# Theater.ke backend and APIs(for KITfest)

KITFest is an immersive and enlightening theatrical experience, where diverse performances and educational opportunities come 
together to inspire and connect artists and audiences from around the world, as well as enjoy the magical Kenya through tourism and cultural experiences.

## Getting Started

### Prerequisites

You will need this technologies to run this application on your laptop, or just use Docker 😀.

- Node.js (20.11.0)
- pnpm (8.14.3)

### Instalation
first you will need to clone this repo
```bash
git clone https://github.com/KitfestProject/backend
```
then..
```bash
cd backend
```
now..
```bash
pnpm i
```
you will need to have an env file for the application, use the below command for that.
```bash
mv .env.example .env
```
You can now run the application with
```bash
pnpm dev
```
to run tests use
```
pnpm test
```
this application can also be runned using docker, just install docker and docker compose then
```bash
docker compose up -d
```
## Docs
DB design

![alt db design](/docs/db_design.png)

DFD

![alt dfd design](/docs/dfd.png)

Check API documatation on postman

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://kerenketepela.postman.co/collection/34498916-fc65e064-4847-41fe-a05a-d4bbf2c17188?source=rip_markdown)
