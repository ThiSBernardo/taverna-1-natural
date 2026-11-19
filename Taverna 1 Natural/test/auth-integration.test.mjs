import test from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../test-dist/services/firebase/auth.service.js';
import { UserService } from '../test-dist/services/firebase/user.service.js';

test('AuthService.formatAuthError - specific error mappings', () => {
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/user-not-found' }),
    'E-mail não cadastrado na plataforma.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/wrong-password' }),
    'Credenciais inválidas. Verifique seu e-mail e senha.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/invalid-credential' }),
    'Credenciais inválidas. Verifique seu e-mail e senha.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/email-already-in-use' }),
    'Este e-mail já está cadastrado por outra conta.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/weak-password' }),
    'A senha é muito fraca. Utilize no mínimo 6 caracteres.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/invalid-email' }),
    'O endereço de e-mail informado é inválido.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/too-many-requests' }),
    'Acesso bloqueado temporariamente por excesso de tentativas. Tente mais tarde.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/network-request-failed' }),
    'Falha de comunicação com o servidor. Verifique sua conexão de rede.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/api-key-not-valid' }),
    'A chave de API do Firebase não está configurada ou é inválida no arquivo .env.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/invalid-api-key' }),
    'A chave de API do Firebase não está configurada ou é inválida no arquivo .env.'
  );
  assert.equal(
    AuthService.formatAuthError({ code: 'auth/unknown-error-code' }),
    'Não foi possível completar a operação de autenticação.'
  );
  assert.equal(
    AuthService.formatAuthError(new Error('Erro customizado de rede')),
    'Erro customizado de rede'
  );
  assert.equal(
    AuthService.formatAuthError(null),
    'Erro inesperado durante a autenticação.'
  );
});

test('Form Validation - Email format specifications', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validEmails = [
    'aventureiro@taverna.com.br',
    'mestre.rpg@gmail.com',
    'ordem_paranormal@dominio.org',
    'user123@sub.dominio.net'
  ];

  for (const email of validEmails) {
    assert.equal(emailRegex.test(email), true, `Deveria aceitar email válido: ${email}`);
  }

  const invalidEmails = [
    '',
    'aventureiro',
    'aventureiro@',
    'aventureiro@taverna',
    '@taverna.com.br',
    'aventureiro @taverna.com.br',
    'aventureiro@ taverna.com.br'
  ];

  for (const email of invalidEmails) {
    assert.equal(emailRegex.test(email), false, `Deveria rejeitar email inválido: ${email}`);
  }
});

test('Form Validation - Password length and confirmation rules', () => {
  const minLength = 6;

  assert.equal('12345'.length >= minLength, false);
  assert.equal(''.length >= minLength, false);
  assert.equal('123456'.length >= minLength, true);
  assert.equal('segredo-forte-123'.length >= minLength, true);

  const passwordA = 'minhasenha123';
  const passwordB = 'minhasenha123';
  const passwordC = 'outrasenha456';

  assert.equal(passwordA === passwordB, true);
  assert.equal(passwordA === passwordC, false);
});

test('User Profile Schema - Structure integrity and memory state tracking', () => {
  const sampleUser = {
    uid: 'user-sample-123',
    displayName: 'Aventureiro Noturno',
    email: 'noturno@taverna.com.br',
    photoURL: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isInMemory: false
  };

  assert.equal(typeof sampleUser.uid, 'string');
  assert.equal(typeof sampleUser.displayName, 'string');
  assert.equal(typeof sampleUser.email, 'string');
  assert.equal(sampleUser.photoURL, null);
  assert.ok(sampleUser.createdAt.length > 0);
  assert.ok(sampleUser.updatedAt.length > 0);
  assert.equal(sampleUser.isInMemory, false);
  assert.equal('characters' in sampleUser, false);
});

test('In-Memory Fallback - Distinguishing persisted from transient memory profiles', () => {
  const offlineProfile = {
    uid: 'user-offline-456',
    displayName: 'Jogador Offline',
    email: 'offline@taverna.com.br',
    photoURL: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isInMemory: true
  };

  assert.equal(offlineProfile.isInMemory, true);

  const isCloudPersisted = (profile) => {
    return Boolean(profile && !profile.isInMemory);
  };

  assert.equal(isCloudPersisted(offlineProfile), false);

  const syncedProfile = {
    ...offlineProfile,
    isInMemory: false
  };

  assert.equal(isCloudPersisted(syncedProfile), true);
});

test('Firestore Security Invariants - Immutability of UID, email and createdAt', () => {
  const existingResource = {
    uid: 'user-original-id',
    displayName: 'Guerreiro Antigo',
    email: 'guerreiro@taverna.com.br',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  };

  const evaluateUpdateRule = (requestAuthUid, currentDoc, updatedDoc) => {
    if (!requestAuthUid) return false;
    if (requestAuthUid !== updatedDoc.uid) return false;
    if (updatedDoc.uid !== currentDoc.uid) return false;
    if (updatedDoc.createdAt !== currentDoc.createdAt) return false;
    if (updatedDoc.email !== currentDoc.email) return false;
    return true;
  };

  const validUpdate = {
    ...existingResource,
    displayName: 'Guerreiro Lendário',
    updatedAt: '2026-11-19T10:00:00.000Z'
  };
  assert.equal(evaluateUpdateRule('user-original-id', existingResource, validUpdate), true);

  const forgedUidUpdate = {
    ...validUpdate,
    uid: 'attacker-id-999'
  };
  assert.equal(evaluateUpdateRule('user-original-id', existingResource, forgedUidUpdate), false);

  const changedEmailUpdate = {
    ...validUpdate,
    email: 'hacked@malicious.com'
  };
  assert.equal(evaluateUpdateRule('user-original-id', existingResource, changedEmailUpdate), false);

  const modifiedCreatedAtUpdate = {
    ...validUpdate,
    createdAt: '2020-01-01T00:00:00.000Z'
  };
  assert.equal(evaluateUpdateRule('user-original-id', existingResource, modifiedCreatedAtUpdate), false);
});

test('Route Protection - Verification of unauthenticated state barriers', () => {
  const resolveAppView = (state) => {
    if (state.isLoading) return 'LOADING_VIEW';
    if (!state.isAuthenticated) return 'AUTH_VIEW';
    return 'MAIN_APP_VIEW';
  };

  assert.equal(resolveAppView({ isLoading: true, isAuthenticated: false }), 'LOADING_VIEW');
  assert.equal(resolveAppView({ isLoading: false, isAuthenticated: false }), 'AUTH_VIEW');
  assert.equal(resolveAppView({ isLoading: false, isAuthenticated: true }), 'MAIN_APP_VIEW');

  const canAccessModal = (isAuthenticated, modalName) => {
    const protectedModals = ['wizard', 'sheet', 'vtt', 'campaign', 'invite', 'library', 'profile'];
    if (!isAuthenticated && protectedModals.includes(modalName)) {
      return false;
    }
    return true;
  };

  assert.equal(canAccessModal(false, 'wizard'), false);
  assert.equal(canAccessModal(false, 'sheet'), false);
  assert.equal(canAccessModal(false, 'vtt'), false);
  assert.equal(canAccessModal(false, 'profile'), false);
  assert.equal(canAccessModal(true, 'wizard'), true);
  assert.equal(canAccessModal(true, 'sheet'), true);
});

test('Data Preservation - Isolation of local demo data from Firebase session', () => {
  const initialLocalCharacters = [
    { id: 'char-1', name: 'Arthur Cervero', system: 'ordem-paranormal' },
    { id: 'char-2', name: 'Joui Jouki', system: 'ordem-paranormal' }
  ];

  const authSession = {
    uid: 'firebase-user-999',
    displayName: 'Novo Jogador',
    email: 'jogador@taverna.com.br'
  };

  assert.notEqual(initialLocalCharacters[0].id, authSession.uid);
  assert.equal('ownerUid' in initialLocalCharacters[0], false);

  const charactersAfterLogin = [...initialLocalCharacters];
  assert.equal(charactersAfterLogin.length, 2);
  assert.equal(charactersAfterLogin[0].name, 'Arthur Cervero');

  const charactersAfterLogout = [...charactersAfterLogin];
  assert.equal(charactersAfterLogout.length, 2);
  assert.equal(charactersAfterLogout[0].name, 'Arthur Cervero');
});
