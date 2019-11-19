# Development

Consulta Publica requiere **Docker** y **Docker compose**.

Una vez que verifique que cuenta con estas dependencias, haga un **FORK** y clone su nuevo repositorio.

## Variables de entorno

En primer lugar debemos adecuar el `docker-compose.yml`

La aplicación utiliza [DemocracyOS 2.11.15](https://hub.docker.com/r/democracyos/democracyos) y requiere **Mongo 3.2**

Es preferente trabajar en el entorno de desarrollo utilizando docker-compose donde definimos las variables de entorno y los servicios con la que la aplicación trabaja, en este caso, mongo 3.2

Recomendamos ver el siguiente `docker-compose.yml` a continuacion para usarlo como base donde podrá editarlo para dar marcha su instancia de desarrollo local.

En el repositorio encontrará la siguiente plantilla en `docker-compose.yaml.example`. Pase el contenido a `docker-compose.yml` y utilice la pĺantilla como base.


```yaml
version: '3'

services:
  app:
    container_name: miconsultapublica
    build: .
    command: ["./node_modules/.bin/gulp", "bws"]
    environment:
      - NODE_ENV=development
      - DEBUG=democracyos*
      - MONGO_URL=mongodb://mongo/mi-consultapublica
      # Importante: Defina el "Staff" de administradores para que en su registro el sistema le de privilegios de admin
      # Para un solo admin:
      # - STAFF=hola@miemail.com
      # Para varios admins:
      # - STAFF=hola@miemail.com,usuario@otroemail.com,otrousuario@nuevoemail.com
      - STAFF=hola@miemail.com
      # Logos
      - LOGO=/ext/lib/site/home-multiforum/logo-header.svg \
      - LOGO_MOBILE=/ext/lib/site/home-multiforum/logo-header.svg \
      # Organizacion
      - ORGANIZATION_EMAIL=miconsultapublica@midominio.com.ar
      - ORGANIZATION_NAME="Mi Consulta Pública"
      # Social media y email settings
      - SOCIALSHARE_SITE_NAME="Mi Consulta Pública"
      - SOCIALSHARE_SITE_DESCRIPTION="Plataforma de participación ciudadana"
      - SOCIALSHARE_IMAGE=https://urlexterno.com/mi-imagen-externa.png #Cambiar
      - SOCIALSHARE_DOMAIN=miconsultapublica.midominio.com #Cambiar
      - SOCIALSHARE_TWITTER_USERNAME=@miConsultaPublica #Cambiar
      - TWEET_TEXT="Estoy tratando de mejorar esta propuesta “{topic.mediaTitle}” ¡Participá vos también!"
      # Configuracion del mailer
      - NOTIFICATIONS_MAILER_EMAIL=miconsultapublica@midominio.com
      - NOTIFICATIONS_MAILER_NAME="Mi consulta ṕública"
      - NOTIFICATIONS_NODEMAILER={"host:"xxxxx.smtp.com","port":465,"secure":true,"auth":{"user":"xxxxxxxx","pass":"xxxxxxx"}} #Cambiar
      # El mail del que recibe los pedidos de verificación de cuentas
      - VERIFY_USER_REQUEST_EMAIL=miadminconsultapublica@midominio.com
      # Requerido: Genere un token para JWT
      - JWT_SECRET= #Cambiar
      # Si desea activar Mi Argentina, descomente los siguientes puntos
      # - CUSTOM_SIGNIN=true
      # - OIDC_ISSUER= #Cambiar
      # - OIDC_AUTH= #Cambiar
      # - OIDC_TOKEN= #Cambiar
      # - OIDC_USER= #Cambiar
      # - OIDC_CLIENT_ID= #Cambiar
      # - OIDC_CLIENT_SECRET= #Cambiar
      # - OIDC_CALLBACK= #Cambiar
    links:
      - mongo 
    ports:
      - 3000:3000
    volumes:
      - ./ext/lib:/usr/src/ext/lib
      - ./public:/usr/src/public
      # Forced overrides of DemocracyOs
      - ./dos-override/models/comment.js:/usr/src/lib/models/comment.js
      - ./dos-override/api-v2/db-api/comments/index.js:/usr/src/lib/api-v2/db-api/comments/index.js
      - ./dos-override/api-v2/db-api/comments/scopes.js:/usr/src/lib/api-v2/db-api/comments/scopes.js
    tty: true

  mongo:
    container_name: miconsultapublica-mongo
    image: mongo:3.2
    ports:
      - 27017:27017
    volumes:
      - ./tmp/db:/data/db

```

##### Notas
* Es muy importante que en `STAFF` agregues el email del admin o el de los administradores.
* Por defecto, tal com esta en el docker-compose, está en el puerto 3000. Puede cambiar el puerto el cual se expone la aplicación (Ej: `3000:9999`)
* Podés comentar las variables `NOTIFICATION_*` si todavía no tenés un servidor de correo definido.
* Si se prefiere conectar a una base de dato local, fuera del entorno, vea el apartado [Conectar a una base de datos mongo local](#local-mongo)
* Podés configurar DemocracyOS con cualquiera de las variables de entorno listadas acá: http://docs.democracyos.org/configuration.html
* El puerto `27017` está expuesto para que puedas administrar la base de datos con algún cliente de MongoDB, por ejemplo con [Robomongo](https://robomongo.org/).
* Todas las vistas personalizadas para Consulta Pública se encuentran en [`/ext`](ext). Siguiendo el mismo patrón de carpetas que [DemocracyOS/democracyos](https://github.com/DemocracyOS/democracyos).


Luego de que todo este definido, podemos arrancar el servidor ejecutando:

```
docker-compose up --build
```

Puede tardar un rato largo en buildear. Cuando haya terminado y si todo sale bien, el servidor y container estarán correctamente levantados y listos para poder trabajar.


Para entrar a la aplicacion a [http://localhost:3000](http://localhost:3000)


## Comandos utiles

Para abrir el server local

```
docker-compose up
```

Si cambia alguna dependencia del `/ext/package.json`, tiene que volver a buildear la imagen de Docker

```
docker-compose up --build
```

Para poder entrar al container de DemocracyOS:

```
docker exec -it miconsultapublica bash
```

Para poder entrar a la base de datos

```
docker exec -it miconsultapublica-mongo bash
```
## Conectar a una base de dato Mongo local

Si lo prefiere, puede conectar la aplicacion a su mongo local. En primer lugar aseguresé que sea **Mongo 3.2**, si no, procure utilizar el container que se construye en el build del docker-compose.

Suponiendo que la base de datos esta en `localhost:27017` cambiar el valor de la variable `MONGO_URL`

```yaml
  app: 
    [...]
    environment:
      [...]
      - MONGO_URL=mongodb://localhost:27017/mi-consultapublica
```
Luego, debe comentar:

```yaml
  app: 
    [...]
    # links:
    #  - mongo 
    [...]
```
Y agregar:

```yaml
  app: 
    [...]
    network_mode: "host"
    [...]
```

Por ultimo debemos comentar el servicio de mongo, para que no se construya el container

```yaml
  # mongo:
  #   container_name: miconsultapublica-mongo
  #   image: mongo:3.2
  #   ports:
  #     - 27017:27017
  #   volumes:
  #     - ./tmp/db:/data/db
```

## Conectar a un servidor SMTP local

Para esto podemos usar la imagen [namshi/smtp](https://hub.docker.com/r/namshi/smtp).

Por ejemplo, si usamos una cuenta de Gmail de prueba, agregar en su compose:

```yaml
  mailserver:
    image: namshi/smtp
    environment:
      - GMAIL_USER=mi-usuario@gmail.com
      - GMAIL_PASSWORD=mi-contraseña-que-no-debo-publicar
```

Posteriormente, cambiar las variables de entorno correspondientes del contenedor `app`:

```yaml
      - NOTIFICATIONS_MAILER_EMAIL=mi-usuario@gmail.com
      - NOTIFICATIONS_NODEMAILER={"host":"mailserver","port":25,"secure":false}
 ```
 
 Notar que si bien la conexión a este servidor SMTP no está cifrada, la conexión del servidor SMTP a Gmail sí lo está.
  
## Extendiendo los modelos de la BBDD o su API

Para hacer esto debes copiar los archivos originales de DoS y agregarlos en la carpeta `dos-overrides`, bajo la misma ruta. Posteriormente incluírlos en `volumes` en el `docker-compose.yml`.