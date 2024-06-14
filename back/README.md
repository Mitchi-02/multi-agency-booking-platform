# Back

## Getting Started

1. **Create a docker network with bridge driver called project-net**
  ```bash
  docker network create --driver bridge project-net
  ```

2. **Fill the required env variables inside deployment/dev/.env**

3. **Launching the Development Environment**
   
To start the development environment, run the following command:

```bash
./serv.sh
```

To stop the development environment, run the following command:

```bash
./exit.sh
```
