# Deployment

Esta guía presenta los pasos necesarios para poder hacer un deployment de consulta pública en plataformas basadas en GNU/Linux. La herramienta de aprovisionamiento seleccionada es [Ansible](https://www.ansible.com).

## Pre-requisitos

**Imágen de Docker**

El sistema de consulta pública se distribuye e instala generando una imágen de [Docker](https://www.docker.com). Es necesario que al momento de seguir esta guía el usuario cuente con una imágen disponible en el [registro oficial de Docker (Docker Hub)](https://hub.docker.com). Los pasos necesarios escapan al foco de esta guía pero pueden resumirse como:
* Crear una cuenta en [Docker Hub](https://hub.docker.com).
* Crear un repositorio en [Docker Hub](https://hub.docker.com).
* Pushear la imágen desde el entorno del desarrollador.

## Requisitos

**Acceso SSH**

Los distintos _playbooks de Ansible_ requieren acceso por SSH al servidor de destino. El mismo debe realizarse mediante la utilización de llaves asimétricas. Estos pasos se explican en [esta completa guía](https://www.digitalocean.com/community/tutorials/como-configurar-las-llaves-ssh-en-ubuntu-18-04-es). Una excelente práctica es utilizar el fichero de configuración del cliente ssh ubicado en `~/.ssh/config`, esto se explica en [esta completa guía (inglés)](https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client).

**Ansible**

Ansible es una herramienta de aprovisionamiento que permite aplicar planes de ejecución llamados _playbooks_ en los cuales se definen una serie de pasos a realizar en uno o más hosts. En este caso utilizamos Ansible para definir la instalación de la plataforma de consulta pública, formalizando y automatizando el proceso. La guía oficial de instalación se encuentra [aquí](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) aunque es muy probable que se encuentre ya disponible en los repositorios oficiales de las distintas distribuciones:

* Versión mínima requerida: 2.3.

```bash
# Ubuntu
$ sudo apt-get install ansible
# RHEL/CentOS/Fedora yum
$ sudo yum install ansible
# RHEL/CentOS/Fedora dnf
$ sudo dnf install ansible
# macOS con brew
$ brew install ansible
# Python pip
$ pip install ansible
```

**Inventario de Ansible**

Ansible utiliza un inventario donde es necesario definir los hosts sobre los cuales va a trabajar. La ubicación por defecto del mismo es `/etc/ansible/inventory`, a modo de ejemplo se muestra como configurar el inventario y a su vez `~/.ssh/config`:

```bash
## Configuración del cliente SSH y el inventario de Ansible sin SSH alias
# Contenido de ~/.ssh/config
Host mi.server.local
  HostName mi.server.local
  User ubuntu
  Port 22

# Contenido de /etc/ansible/inventory
[servidores]
mi-server   ansible_ssh_host=mi.server.local ansible_connection=ssh ansible_port=22 ansible_user=ubuntu
```

```bash
## Configuración del cliente SSH y el inventario de Ansible con SSH alias
# Contenido de ~/.ssh/config
Host serveralias
  HostName mi.server.local
  User ubuntu
  Port 22

# Contenido de /etc/ansible/inventory
[servidores]
mi-server   ansible_ssh_host=serveralias ansible_connection=ssh ansible_port=22 ansible_user=ubuntu
```

## Plataformas Soportadas
El deployment está basado en Docker y docker-compose. Estos playbooks fueron probados con [Vagrant](https://www.vagrantup.com) utilizando boxes oficiales:
* CentOS (7.3, 7.4, 7.5).
* Debian (8 y 9).
* Ubuntu (16.04 LTS y 18.04 LTS, 14.04 ya no tiene soporte).

## Playbooks

### Instalación de Docker
La primera tarea a realizar es la instalación de Docker en el servidor de destino. Esto se realiza con el playbook `instalacion_docker.yaml` de la siguiente forma:

```bash
$ ansible-playbook instalacion_docker.yaml --extra-vars "host_destino=<nombre-server-en-el-inventario>"
```

### Instalación de la plataforma
