# App

Gympass style app

## RFs

- [x] Deve ser possivel se cadastrar
- [x] Deve ser possivel se autenticar
- [x] Deve ser possivel obter o perfil de um usuário logado
- [x] Deve ser possivel obter o número de checkins realizados pelo usuário
- [x] Deve ser possivel o usuário obter seu histórico de checkins
- [x] Deve ser possivel o usuário buscar academias próximas (até 10km)
- [x] Deve ser possivel o usuário buscar academias pelo nome
- [x] Deve ser possivel o usuário realizar checkin em uma academia
- [x] Deve ser possivel validar o checkin de um usuário
- [x] Deve ser possivel cadastrar academias

## RNs

- [x] O usuário não deve poder se cadatrar com email suplicado
- [x] O usurio não pode fazer 2 checkins no mesmo dia
- [x] O usuário só pode fazer checkin a 100m ou menos da academia
- [x] O usuário só pode ser validado até 20min depois de ser criado
- [x] O checkin só pode ser validado por adminin
- [x] A academia só pode ser cadastrada por um admin

## RNFs

- [x] A senha do usuário deve ser criptografada
- [x] Os dados precisam estar persistidos no PostrgeSQL
- [x] Todas as listas de dados devem ser paginadas com 20 itens por págia
- [x] O usuário deve ser identificado por um JWT