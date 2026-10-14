# Cuentas y Acceso

## Purpose

Permitir que una persona cree una cuenta en FlowSync, inicie y cierre sesión, y consulte su perfil, tanto a través de la API HTTP como de la aplicación web. El acceso a la cuenta se autentica con un token opaco de tipo Bearer.

## Requirements

### Requirement: Registro de cuenta

El sistema SHALL permitir crear una cuenta mediante `POST /api/v1/auth/signup` con `email`, `password`, `passwordConfirmation` y un `fullName` opcional, y SHALL responder con la cuenta creada y un token de acceso válido, de modo que la persona queda autenticada sin un login aparte.

#### Scenario: Registro correcto con nombre

- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName` "Ada Lovelace", un `email` válido no registrado, una `password` de entre 8 y 32 caracteres y una `passwordConfirmation` idéntica
- **THEN** la respuesta es `200` con un cuerpo `{ "data": { "user": {...}, "token": "<token>" } }`, donde `user` contiene `id`, `fullName`, `email`, `initials`, `createdAt` y `updatedAt`, y `token` es una cadena que sirve como credencial Bearer

#### Scenario: Registro correcto sin nombre

- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName` a `null` y el resto de campos válidos
- **THEN** la respuesta es `200` y el `user` devuelto tiene `fullName` a `null`

#### Scenario: La respuesta nunca expone la contraseña

- **WHEN** un registro se completa con éxito
- **THEN** el objeto `user` de la respuesta no contiene la contraseña ni ningún derivado de ella

### Requirement: Validación del registro

El sistema SHALL rechazar con `422` cualquier registro cuyos datos no cumplan las reglas, devolviendo un cuerpo `{ "errors": [ { "message", "rule", "field", "meta"? } ] }` con una entrada por cada regla incumplida, y SHALL NOT crear la cuenta.

#### Scenario: Email ya registrado

- **WHEN** se intenta registrar una cuenta con un `email` que ya pertenece a otra cuenta
- **THEN** la respuesta es `422` con un error sobre el campo `email` y regla `database.unique`, y no se crea una segunda cuenta

#### Scenario: Email con formato inválido

- **WHEN** se intenta registrar una cuenta con un `email` que no tiene formato de dirección de correo
- **THEN** la respuesta es `422` con un error sobre el campo `email` y regla `email`

#### Scenario: Email demasiado largo

- **WHEN** se intenta registrar una cuenta con un `email` de más de 254 caracteres
- **THEN** la respuesta es `422` con un error sobre el campo `email` y regla `maxLength`

#### Scenario: Contraseña demasiado corta

- **WHEN** se intenta registrar una cuenta con una `password` de menos de 8 caracteres
- **THEN** la respuesta es `422` con un error sobre el campo `password`, regla `minLength` y `meta.min` igual a 8

#### Scenario: Contraseña demasiado larga

- **WHEN** se intenta registrar una cuenta con una `password` de más de 32 caracteres
- **THEN** la respuesta es `422` con un error sobre el campo `password`, regla `maxLength` y `meta.max` igual a 32

#### Scenario: Confirmación que no coincide

- **WHEN** se intenta registrar una cuenta con una `passwordConfirmation` distinta de `password`
- **THEN** la respuesta es `422` con un error sobre el campo `passwordConfirmation` y regla `sameAs`

#### Scenario: Campo obligatorio ausente

- **WHEN** se intenta registrar una cuenta omitiendo `email`, `password` o `passwordConfirmation`
- **THEN** la respuesta es `422` con un error de regla `required` sobre cada campo omitido

#### Scenario: Nombre omitido en lugar de nulo

- **WHEN** se intenta registrar una cuenta sin incluir la clave `fullName` en el cuerpo
- **THEN** la respuesta es `422` con un error de regla `required` sobre el campo `fullName`

### Requirement: Inicio de sesión

El sistema SHALL emitir un nuevo token de acceso mediante `POST /api/v1/auth/login` cuando el `email` y la `password` corresponden a una cuenta existente.

#### Scenario: Credenciales correctas

- **WHEN** se envía `POST /api/v1/auth/login` con el `email` y la `password` de una cuenta existente
- **THEN** la respuesta es `200` con `{ "data": { "user": {...}, "token": "<token>" } }`, con la misma forma de `user` que en el registro

#### Scenario: Varias sesiones simultáneas

- **WHEN** una misma cuenta inicia sesión varias veces sin cerrar las anteriores
- **THEN** cada inicio de sesión devuelve un token distinto y todos siguen siendo válidos a la vez

### Requirement: Rechazo de credenciales inválidas

El sistema SHALL responder `400` con `{ "errors": [ { "message": "Invalid user credentials" } ] }`, sin indicar campo, cuando el email no existe o la contraseña no es la de la cuenta, y SHALL NOT revelar cuál de los dos ha fallado.

#### Scenario: Contraseña incorrecta

- **WHEN** se envía `POST /api/v1/auth/login` con el `email` de una cuenta existente y una `password` distinta de la suya
- **THEN** la respuesta es `400` con el mensaje genérico de credenciales inválidas y no se emite token

#### Scenario: Email no registrado

- **WHEN** se envía `POST /api/v1/auth/login` con un `email` con formato válido que no pertenece a ninguna cuenta
- **THEN** la respuesta es `400` con el mismo mensaje genérico que para una contraseña incorrecta

### Requirement: Validación del inicio de sesión

El sistema SHALL rechazar con `422` y el formato de errores por campo un intento de login cuyo `email` no sea una dirección válida de como máximo 254 caracteres o en el que falte `email` o `password`, antes de comprobar las credenciales.

#### Scenario: Email con formato inválido en el login

- **WHEN** se envía `POST /api/v1/auth/login` con un `email` sin formato de correo
- **THEN** la respuesta es `422` con un error sobre el campo `email` y regla `email`

#### Scenario: Contraseña ausente en el login

- **WHEN** se envía `POST /api/v1/auth/login` sin el campo `password`
- **THEN** la respuesta es `422` con un error sobre el campo `password` y regla `required`

### Requirement: Consulta del perfil propio

El sistema SHALL devolver los datos de la cuenta autenticada mediante `GET /api/v1/account/profile` cuando la petición lleva una cabecera `Authorization: Bearer <token>` con un token válido.

#### Scenario: Perfil con token válido

- **WHEN** se envía `GET /api/v1/account/profile` con un token válido
- **THEN** la respuesta es `200` con `{ "data": { "id", "fullName", "email", "initials", "createdAt", "updatedAt" } }` de la cuenta dueña del token

### Requirement: Iniciales del usuario

El sistema SHALL incluir en cada representación de usuario un campo `initials` en mayúsculas calculado así: si hay `fullName` con al menos dos palabras separadas por espacio, la primera letra de las dos primeras palabras; si `fullName` tiene una sola palabra, sus dos primeras letras; si no hay `fullName`, la primera letra de la parte local del email seguida de la primera letra del dominio.

#### Scenario: Nombre con nombre y apellido

- **WHEN** se consulta un usuario con `fullName` "Ada Lovelace"
- **THEN** `initials` vale "AL"

#### Scenario: Nombre de una sola palabra

- **WHEN** se consulta un usuario con `fullName` "ada"
- **THEN** `initials` vale "AD"

#### Scenario: Sin nombre

- **WHEN** se consulta un usuario con `fullName` a `null` y `email` "ada@flowsync.dev"
- **THEN** `initials` vale "AF"

### Requirement: Protección de las rutas de cuenta

El sistema SHALL rechazar con `401` y `{ "errors": [ { "message": "Unauthorized access" } ] }` toda petición a `GET /api/v1/account/profile` o `POST /api/v1/account/logout` que no lleve un token Bearer válido.

#### Scenario: Sin cabecera de autorización

- **WHEN** se envía `GET /api/v1/account/profile` sin cabecera `Authorization`
- **THEN** la respuesta es `401` con el mensaje "Unauthorized access"

#### Scenario: Token desconocido o revocado

- **WHEN** se envía `GET /api/v1/account/profile` con un token que nunca existió o que ya se revocó con un logout
- **THEN** la respuesta es `401` con el mensaje "Unauthorized access"

### Requirement: Cierre de sesión en el servidor

El sistema SHALL revocar el token con el que se hace la petición a `POST /api/v1/account/logout` y SHALL responder `200` con `{ "message": "Logged out successfully" }`, sin envoltorio `data`. Los demás tokens de la misma cuenta SHALL seguir siendo válidos.

#### Scenario: Logout con token válido

- **WHEN** se envía `POST /api/v1/account/logout` con un token válido
- **THEN** la respuesta es `200` con `{ "message": "Logged out successfully" }` y cualquier petición posterior con ese mismo token recibe `401`

#### Scenario: Logout no afecta a otras sesiones

- **WHEN** una cuenta tiene dos tokens activos y hace logout con uno de ellos
- **THEN** el otro token sigue permitiendo consultar el perfil

### Requirement: Respuestas siempre en JSON

El sistema SHALL responder en JSON en todas las rutas de cuentas y acceso, incluidas las de error, con independencia de la cabecera `Accept` que envíe el cliente.

#### Scenario: Cliente que pide HTML

- **WHEN** se envía `GET /api/v1/account/profile` sin token y con `Accept: text/html`
- **THEN** la respuesta es `401` con cuerpo JSON `{ "errors": [ { "message": "Unauthorized access" } ] }`, no una página HTML ni una redirección

### Requirement: Pantalla de registro

La aplicación web SHALL ofrecer en `/register` un formulario titulado "Crea tu cuenta" con los campos "Nombre completo (opcional)", "Email", "Contraseña" (con la ayuda "Entre 8 y 32 caracteres.") y "Repite la contraseña", un botón "Crear cuenta" y un enlace "Inicia sesión" que lleva a `/login`.

#### Scenario: Registro correcto desde la web

- **WHEN** una persona sin sesión rellena el formulario de registro con datos válidos y pulsa "Crear cuenta"
- **THEN** el botón muestra "Creando cuenta…" y queda deshabilitado mientras se envía, y al completarse la persona queda con sesión iniciada y ve su perfil en `/profile`

#### Scenario: Nombre en blanco

- **WHEN** una persona deja "Nombre completo" vacío o solo con espacios y completa el registro
- **THEN** la cuenta se crea sin nombre y el perfil muestra "Sin nombre"

#### Scenario: Contraseñas distintas detectadas en el navegador

- **WHEN** una persona escribe valores distintos en "Contraseña" y "Repite la contraseña" y pulsa "Crear cuenta"
- **THEN** bajo "Repite la contraseña" aparece "Las contraseñas no coinciden." y no se envía nada al servidor

#### Scenario: Email ya registrado desde la web

- **WHEN** una persona intenta registrarse con un email que ya tiene cuenta
- **THEN** bajo el campo "Email" aparece "Ese email ya está registrado. Inicia sesión en su lugar." y sigue en la pantalla de registro con lo que había escrito

#### Scenario: Errores de validación por campo

- **WHEN** el servidor rechaza el registro por uno o varios campos inválidos
- **THEN** cada campo afectado muestra debajo un mensaje en castellano (por ejemplo "la contraseña debe tener al menos 8 caracteres." o "Introduce una dirección de email válida."), uno por campo, y el campo se marca como inválido

### Requirement: Pantalla de inicio de sesión

La aplicación web SHALL ofrecer en `/login` un formulario titulado "Inicia sesión" con los campos "Email" y "Contraseña", un botón "Entrar" y un enlace "Crea una" que lleva a `/register`.

#### Scenario: Login correcto desde la web

- **WHEN** una persona sin sesión introduce credenciales correctas y pulsa "Entrar"
- **THEN** el botón muestra "Entrando…" y queda deshabilitado mientras se envía, y al completarse la persona ve su perfil en `/profile`

#### Scenario: Credenciales incorrectas desde la web

- **WHEN** una persona introduce un email o una contraseña que no son correctos y pulsa "Entrar"
- **THEN** aparece un aviso destacado sobre el formulario con "El email o la contraseña no son correctos." y sigue en `/login`

#### Scenario: Email mal formado en el login

- **WHEN** una persona introduce un email sin formato válido y pulsa "Entrar"
- **THEN** bajo el campo "Email" aparece "Introduce una dirección de email válida."

### Requirement: Avisos generales en los formularios de acceso

La aplicación web SHALL mostrar como aviso destacado sobre el formulario de login o registro cualquier error que no pueda colocarse bajo un campo visible de la pantalla.

#### Scenario: Servidor inaccesible

- **WHEN** una persona envía el formulario de login o de registro y el servidor no responde
- **THEN** aparece el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y el botón vuelve a estar disponible

#### Scenario: Error interno del servidor

- **WHEN** una persona envía el formulario y el servidor responde con un error no previsto
- **THEN** aparece el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

### Requirement: Persistencia de la sesión en el navegador

La aplicación web SHALL conservar la sesión entre recargas y cierres de pestaña del mismo navegador, y SHALL validarla contra el servidor al arrancar antes de mostrar contenido protegido.

#### Scenario: Recarga con sesión válida

- **WHEN** una persona con sesión iniciada recarga la página en `/profile`
- **THEN** ve un indicador de carga a pantalla completa mientras se comprueba la sesión y después su perfil, sin pasar por `/login`

#### Scenario: Sesión revocada o caducada al arrancar

- **WHEN** una persona abre la aplicación con una sesión guardada que el servidor ya no reconoce
- **THEN** la sesión guardada se descarta, es llevada a `/login` y ve el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión."

#### Scenario: Servidor caído al arrancar

- **WHEN** una persona abre la aplicación con una sesión guardada y el servidor no responde
- **THEN** es llevada a `/login` con el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado.", y la sesión guardada se conserva, de forma que al recargar con el servidor disponible vuelve a entrar sin introducir credenciales

#### Scenario: El aviso de sesión perdida cede ante un nuevo intento

- **WHEN** una persona está en `/login` viendo el aviso de sesión perdida y envía un login fallido
- **THEN** el aviso pasa a mostrar el error de ese intento en lugar del de la sesión perdida

### Requirement: Rutas protegidas y rutas solo públicas

La aplicación web SHALL restringir `/profile` a personas con sesión, SHALL restringir `/login` y `/register` a personas sin sesión, y SHALL redirigir cualquier otra dirección a `/profile`.

#### Scenario: Acceso al perfil sin sesión

- **WHEN** una persona sin sesión navega a `/profile`
- **THEN** es redirigida a `/login`

#### Scenario: Acceso a login o registro con sesión

- **WHEN** una persona con sesión navega a `/login` o a `/register`
- **THEN** es redirigida a `/profile`

#### Scenario: Dirección desconocida

- **WHEN** una persona navega a una dirección que no es `/login`, `/register` ni `/profile`
- **THEN** es redirigida a `/profile`, y de ahí a `/login` si no tiene sesión

#### Scenario: Navegación durante la comprobación de sesión

- **WHEN** la aplicación aún está validando una sesión guardada y la persona está en cualquier ruta
- **THEN** ve el indicador de carga a pantalla completa y no es redirigida hasta que la comprobación termina

### Requirement: Pantalla de perfil

La aplicación web SHALL mostrar en `/profile` las iniciales de la persona en un avatar circular, su nombre completo (o "Sin nombre" si no tiene), su email y la fecha de alta como "Miembro desde" en formato largo en castellano.

#### Scenario: Perfil con nombre

- **WHEN** una persona llamada "Ada Lovelace" que se registró el 13 de octubre de 2026 abre `/profile`
- **THEN** ve el avatar "AL", el nombre "Ada Lovelace", su email y "Miembro desde 13 de octubre de 2026"

#### Scenario: Perfil sin nombre

- **WHEN** una persona registrada sin nombre abre `/profile`
- **THEN** ve "Sin nombre" en lugar del nombre y las iniciales calculadas a partir de su email

### Requirement: Cierre de sesión desde la web

La aplicación web SHALL ofrecer en el perfil un botón "Cerrar sesión" que termina la sesión en el navegador de inmediato y lleva a `/login`, haya podido o no revocarla en el servidor.

#### Scenario: Cerrar sesión

- **WHEN** una persona con sesión pulsa "Cerrar sesión" en su perfil
- **THEN** es llevada a `/login` sin ningún aviso de error, y al recargar o volver a `/profile` sigue sin sesión

#### Scenario: Cerrar sesión con el servidor caído

- **WHEN** una persona pulsa "Cerrar sesión" y el servidor no responde
- **THEN** igualmente es llevada a `/login` sin sesión y sin ver ningún error

---


# Parte B: las 3 lineas

1. **Requisitos escritos vs revisados**
	- Cuántos requisitos escribió el agente: 17 requisitos (Backend -API HTTP-: 10 y Frontend -pantallas-: 7), con 48 escenarios en total.
	- Cuántos comprobé abriendo el código: 7

2. **Las incoherencias que aparecieron al escribirla.** 
	Sinceramente no llegué a detectar incoherencias. Creí ahber detectado la siguiente: 
	> Requirement: Validación del inicio de sesión, no se contempla el scenario de email ausente, solo se considera el scenario de email con formato invalido (invalido no es lo mismo que ausente).
	Pero luego dicho escenario aparece mas adelante.
	
	Debido a esto corrí el prompt numero 10:
	```
	Ponte en el rol de un revisor de Requerimientos. Lee `docs/spec-viva/CMR.md` he indica posibles incoherencias que aparecen en dicho documento de spec. Una línea cada una, con dónde se ve.
	```
	Me listo 11 posibles inconsistencias. Entre ellas las primeras eran de relevantes.
	Ejemplos:
	1. fullName se llama "opcional" pero es obligatorio. L11 dice que el registro acepta "un fullName opcional"; L67-70 dice que omitir la clave devuelve 422 required. En la API solo admite ser null, no faltar.
	2. Una entrada por regla frente a una por campo. L30 promete "una entrada por cada regla incumplida"; L206 habla de mensajes "uno por campo". VineJS deja de comprobar un campo en su primer error, así que lo correcto parece L206.
	3. No revelar emails en el login, pero sí en el registro. L88 exige no revelar si el email existe; L35 devuelve database.unique y L201 dice "Ese email ya está registrado". Cualquiera puede averiguar qué emails tienen cuenta.

3. **Lo que podría estar bien o mal:**
	1. Los tokens no caducan nunca. No hay fecha de caducidad configurada. Escribir "un token nunca caduca" no se puede comprobar en un escenario. Además, el texto del frontend "Tu sesión ha caducado" es engañoso: el único caso real en que pasa es un token revocado o desconocido.
	

