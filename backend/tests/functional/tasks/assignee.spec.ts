import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea enseña de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: nombre e iniciales bastan para identificarlo,
 * ningún dato de la cuenta viaja con la tarea, y una cuenta sin nombre sigue
 * teniendo iniciales.
 *
 * Cada scenario se comprueba en las dos lecturas que devuelven una tarea: la
 * tarea suelta y la lista. El requisito no distingue entre ellas.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // La tarea suelta exige el día de quien mira; cualquiera vale aquí.
  const today = '2026-10-26'

  async function sesion(client: any, fullName: string | null, email: string) {
    await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return response.body().data.token as string
  }

  async function crearTarea(client: any, token: string, title: string) {
    const response = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title })

    response.assertStatus(201)
    return response.body().data.id as number
  }

  async function leerSuelta(client: any, token: string, id: number) {
    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    return response.body().data
  }

  async function leerDeLaLista(client: any, token: string, id: number) {
    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    return response.body().data.find((tarea: { id: number }) => tarea.id === id)
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const token = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const id = await crearTarea(client, token, 'Revisar el informe')

    for (const tarea of [
      await leerSuelta(client, token, id),
      await leerDeLaLista(client, token, id),
    ]) {
      assert.equal(tarea.assignee.fullName, 'Ada Lovelace')
      assert.equal(tarea.assignee.initials, 'AL')
    }
  })

  test('la tarea no lleva el email ni otros datos de la cuenta', async ({ client, assert }) => {
    const token = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const id = await crearTarea(client, token, 'Revisar el informe')

    for (const [lectura, tarea] of [
      ['suelta', await leerSuelta(client, token, id)],
      ['lista', await leerDeLaLista(client, token, id)],
    ]) {
      assert.notProperty(tarea.assignee, 'email', `la tarea ${lectura} expone el email`)
      assert.notProperty(tarea.assignee, 'password', `la tarea ${lectura} expone la contraseña`)

      const serialized = JSON.stringify(tarea.assignee)
      assert.notInclude(serialized, 'ada@example.com', `la tarea ${lectura} filtra el email`)
      assert.notInclude(serialized, 'secreto123', `la tarea ${lectura} filtra la contraseña`)
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client, null, 'sin-nombre@example.com')
    const id = await crearTarea(client, token, 'Revisar el informe')

    for (const tarea of [
      await leerSuelta(client, token, id),
      await leerDeLaLista(client, token, id),
    ]) {
      assert.isNull(tarea.assignee.fullName)
      assert.equal(tarea.assignee.initials, 'SE')
    }
  })
})
