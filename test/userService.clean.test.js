const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('cria um usuário ativo com os dados informados', () => {
    const dadosUsuario = {
      nome: 'Fulano de Tal',
      email: 'fulano@teste.com',
      idade: 25,
    };

    const usuarioCriado = userService.createUser(
      dadosUsuario.nome,
      dadosUsuario.email,
      dadosUsuario.idade
    );

    expect(usuarioCriado).toEqual(expect.objectContaining({
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      idade: dadosUsuario.idade,
      status: 'ativo',
    }));
    expect(usuarioCriado.id).toEqual(expect.any(String));
  });

  test('busca um usuário existente pelo identificador', () => {
    const usuarioCriado = userService.createUser('Fulano', 'fulano@teste.com', 25);

    const usuarioEncontrado = userService.getUserById(usuarioCriado.id);

    expect(usuarioEncontrado).toBe(usuarioCriado);
  });

  test('desativa um usuário comum', () => {
    const usuario = userService.createUser('Comum', 'comum@teste.com', 30);

    const resultado = userService.deactivateUser(usuario.id);

    expect(resultado).toBe(true);
    expect(userService.getUserById(usuario.id).status).toBe('inativo');
  });

  test('não desativa um usuário administrador', () => {
    const administrador = userService.createUser(
      'Admin',
      'admin@teste.com',
      40,
      true
    );

    const resultado = userService.deactivateUser(administrador.id);

    expect(resultado).toBe(false);
    expect(userService.getUserById(administrador.id).status).toBe('ativo');
  });

  test('gera um relatório contendo os usuários cadastrados', () => {
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain('Nome: Alice');
    expect(relatorio).toContain('Nome: Bob');
    expect(relatorio).toContain('Status: ativo');
  });

  test('informa quando o relatório não possui usuários cadastrados', () => {
    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });

  test('rejeita a criação de usuário menor de idade', () => {
    const criarUsuario = () => userService.createUser('Menor', 'menor@email.com', 17);

    expect(criarUsuario).toThrow('O usuário deve ser maior de idade.');
  });
});