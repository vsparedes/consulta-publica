# Consejos para el desarrollo

Al ser una "extension" de DemocracyOS, mucho del código viene por el lado de la plataforma base. Para eso, es recomendable tambien tener el codigo de DemocracyOS a mano por si existen api endpoints o vistas que necesite consultar.

Esta extension agrega otros api endpoints y vistas que complementan a DemocracyOS y permiten la correcta operacion de la plataforma.

Supuestamente todo lo que usted debe modificar (si es necesario) existira bajo la carpeta `/ext`

Luego, siguiendo la estructura de DemocracyOS, se tiene:

* Todo lo que sea el sitio web, bajo `/ext/site`
* Todo lo que sea el panel de admin, bajo `/ext/admin`
* Nuevas api endpoints *pueden* llegar a convivir en `/ext/api`
* Nuevas interfaces con la base de dato *pueden* llegar a convivir en `/ext/db-api`

**NOTA:** Recomendamos tener mucho cuidado en la implementacion de funcionalidades complejas que impliquen el backend. Probablemente el interes se encuentre en la personalizacion del sitio web.

#### Dependencias
- ExpressJS
- Mongoose
- React
- Style (css)

#### Algunas consideraciones:

- Si el servicio está levantado, el sitio puede buidearse on-demand debido al watch. O sea, todo cambio que haga en `/ext/site` tiene un watcher que mira cambios. No tiene hot-reload, debe recargar la pagina en cada cambio.
- A igual que el punto anterior, tambien todo CSS se buildea y cuenta con un watcher. Es necesario tambien recargar la pagina.
- Si hace cambios en la API, debe detener el servicio (`Ctrl + C`) y volver a levantarlo. No cuenta con un watcher para buildear el codigo.
