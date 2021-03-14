export default {
    commands: [
        {cmd: '/me', args: '[Mensagem]', description: 'Manda um /me', level: 0},
        {cmd: '/do', args: '[Mensagem]', description: 'Manda um /do', level: 0},
        {cmd: '/goto', args: '[x] [y] [z] | [ID Jogador]', description: 'Teleporta o jogador para uma localização', level: 2},
        {cmd: '/toggleadmin', args: '', description: 'Entra em modo de administrador', level: 10},
        {cmd: '/bring', args: '[ID Jogador]', description: 'Rodar veiculo para posição correta', level: 10},
        {cmd: '/car', args: '[Nome veiculo]', description: 'Criar um veiculo', level: 10},
        {cmd: '/flip', args: '', description: 'Rodar veiculo para posição correta', level: 10},
        {cmd: '/revive', args: '[ID Jogador]', description: 'Reviver um jogador', level: 10},
        {cmd: '/revivestatus', args: '[ID Jogador]', description: 'Recuperar a comida e sede do jogador', level: 10},
        {cmd: '/giveweapon', args: '[ID Jogador] [Modelo]', description: 'Dar uma arma a um jogador', level: 10},
        {cmd: '/fix', args: '', description: 'Reparar um veiculo', level: 10},
        {cmd: '/noclip', args: '', description: 'Ativar noclip', level: 10},
        {cmd: '/setperm', args: '[ID Jogador] [Permissão]', description: 'Definir nivel de permissão para um jogador', level: 10},
        {cmd: '/giveitem', args: '[ID Jogador] [Item ID] [Quantidade]', description: 'Dá um item ao jogador', level: 10},
        {cmd: '/removeitem', args: '[ID Jogador] [Item ID] [Quantidade]', description: 'Remove um item do jogador', level: 10},
        {cmd: '/dv', args: '', description: 'Elimina o veiculo mais proximo', level: 10},
        //Vehicle
        {cmd: '/gotocar', args: '[Matricula]', description: 'Teleportar para a posiçao de um veiculo', level: 10},
        {cmd: '/bringcar', args: '[Matricula]', description: 'Teleportar um veiculo para a tua posição', level: 10},

        {cmd: '/kick', args: '[ID Jogador] [Razão]', description: 'Expulsar um jogador', level: 10},
        {cmd: '/ban', args: '[ID Jogador] [Razão] [Tempo]', description: 'Banir um jogador', level: 10},
    ]
}