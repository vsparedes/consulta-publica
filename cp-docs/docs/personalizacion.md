# Personalización

Todo lo que necesita para adaptar su plataforma es modificar textos o imagenes bajo la carpeta `/ext/site`.

A continuacion damos un listado importantes 

## Imagenes para cambiar

- Icono del navbar y footer: `/ext/lib/site/home-multiforum/assets/logo_consulta-publica.svg`
- Background del header del home: `/ext/lib/site/home-multiforum/assets/header_consulta-publica.png`
- Iconos del listado del home: 
  - `/ext/lib/site/home-multiforum/assets/icono_consulta-publica-1.svg`
  - `/ext/lib/site/home-multiforum/assets/icono_consulta-publica-2.svg`
  - `/ext/lib/site/home-multiforum/assets/icono_consulta-publica-3.svg`
- Iconos del header: `/ext/lib/site/home-multiforum/assets/logo-header.svg`
- Iconos del footer: `/ext/lib/site/footer/assets/logo-footer.svg`

## Textos para cambiar

Se pueden cambiar cualquier texto dentro de `/ext/lib/site`. Algunas vistas pueden llegar a utilizar algun componente de **i18n** donde la funcion `t("mi.label")` toma del archivo de traduccion `es.json` ubicado en `/ext/translations/lib/es.json`

Si hay etiquetas de i18n que no se encuentran en el `es.json` lo mas probable es que vengan del core de DemocracyOS.

Si se quiere ver esos archivos, lo mas conveniente es entrar al bash del container o ver el repositorio de DemocracyOS en GitHub.

Para entrar al bash del container, ejecutar:

```
docker exec -it <containername> bash
```

El bash abre en `/usr/src` y ahi se encontraria el codigo de todo DemocracyOS y la carpeta ext que es de este repositorio.

## Vistas

Para overraidear vistas lo mejor es partir de la implementacion de DemocracyOS (entrando a su bash) y hacer su copia en la carpeta `/ext/lib` 

Se hacen las modificaciones y se tiene que declarar su override en el archivo `/ext/lib/site/boot/overrides.js`

Este seria un ejemplo de como overraidear una vista de DemocracyOS por una personalizada.

```js
import 'ext/lib/boot/overrides'

import * as HomeForum from 'lib/site/home-forum/component'
import HomeForumExt from 'ext/lib/site/home-forum/component'

import * as HomeMultiForum from 'lib/site/home-multiforum/component'
import HomeMultiForumExt from 'ext/lib/site/home-multiforum/component'

import * as TopicLayout from 'lib/site/topic-layout/component'
import TopicLayoutExt from 'ext/lib/site/topic-layout/component'

import * as Help from 'lib/site/help/component'
import HelpExt from 'ext/lib/site/help/component'

import * as SignIn from 'lib/site/sign-in/component'
import SignInExt from 'ext/lib/site/sign-in/component'


HomeForum.default = HomeForumExt
HomeMultiForum.default = HomeMultiForumExt
TopicLayout.default = TopicLayoutExt
Help.default = HelpExt
SignIn.default = SignInExt
```

## Assets

Cada carpeta dentro de `/ext/lib/site` cuenta con las vistas y cada una de ellas puede contar con una carpeta `assets` del cual el componente puede referenciar a esta carpeta.

Cuando se realiza el build, la estructura de carpetas se mantiene. O sea, si tengo un asset en `/ext/lib/site/home-multiforum/assets/logo_consulta-publica.svg` entonces en la URL lo tendre en `http://localhost:3000/ext/lib/site/home-multiforum/logo_consulta-publica.svg`

Note que en el codigo del componente de home-multiforum se referencia usando `url()` o si es un tag `<img>` con `src=` se hace asi:

```
<img
  src="/ext/lib/site/home-multiforum/logo_consulta-publica.svg"
  alt="Logo"
  width="270px"
/>
```