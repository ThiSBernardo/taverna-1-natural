const STORAGE_KEYS = {
    USER: 'darkage_user_profile',
    CHARACTERS: 'darkage_characters',
    CAMPAIGNS: 'darkage_campaigns',
    GUILDS: 'darkage_guilds',
    SHOP: 'darkage_shop_items',
    ROLLS: 'darkage_dice_rolls',
};
// Seed User
const INITIAL_USER = {
    id: 'user-thiago',
    username: 'thiagosbernardo',
    displayName: 'ThiSBernardo',
    email: 'thiago.bernardo@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    friendCode: 'LDp0UyPH',
    discordTag: 'ThiSBernardo#1337',
    bio: 'Mestre e jogador apaixonado por investigação paranormal, fantasia sombria e histórias memoráveis.',
    coins: 240,
    plan: 'duque',
    status: 'online',
    themeMode: 'dark',
    accentColor: '#8b5cf6',
    uiStyle: 'glass',
    availability: [
        { day: 'Seg', shifts: ['noite'] },
        { day: 'Ter', shifts: ['noite'] },
        { day: 'Qua', shifts: ['noite'] },
        { day: 'Qui', shifts: ['noite'] },
        { day: 'Sex', shifts: ['noite'] },
        { day: 'Sab', shifts: ['tarde', 'noite'] },
        { day: 'Dom', shifts: ['manha', 'tarde'] },
    ],
    preferredGenres: ['Dark Fantasy', 'Terror Cósmico', 'Investigação', 'Cyberpunk'],
    friends: [
        {
            id: 'f1',
            name: 'Gabriel "Mestre" Lima',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
            status: 'online',
            friendCode: 'GM892KL',
            discordTag: 'LimaRPG#0042',
            currentActivity: 'Mestrando O Segredo da Floresta'
        },
        {
            id: 'f2',
            name: 'Mariana Duarte',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            status: 'ausente',
            friendCode: 'MARI554',
            discordTag: 'MariD#9981'
        },
        {
            id: 'f3',
            name: 'Lucas "Kael" Silva',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            status: 'ocupado',
            friendCode: 'KAEL112',
            discordTag: 'Kael#2311',
            currentActivity: 'Editando ficha de D&D'
        }
    ],
    notifications: [
        {
            id: 'notif-1',
            title: 'Convite para Sessão',
            message: 'Gabriel Lima convidou você para a sessão de amanhã às 20h.',
            date: 'Hoje, 10:15',
            read: false,
            type: 'invite',
            actionData: { campaignId: 'camp-1' }
        },
        {
            id: 'notif-2',
            title: 'Pedido de Amizade',
            message: 'Lucas "Kael" adicionou você como amigo.',
            date: 'Ontem',
            read: true,
            type: 'friend'
        }
    ]
};
// Seed Characters
const INITIAL_CHARACTERS = [
    {
        id: 'char-arthur',
        name: 'Arthur Veríssimo',
        systemId: 'ordem-paranormal',
        ownerType: 'player',
        assignedUser: 'ThiSBernardo',
        campaignId: 'camp-1',
        folder: 'O Segredo da Floresta',
        characterClass: 'Especialista',
        subclass: 'Atirador de Elite',
        levelOrNex: 20, // 20% NEX
        originOrBackground: 'Investigador',
        attributes: {
            AGI: 3,
            FOR: 1,
            INT: 3,
            PRE: 2,
            VIG: 2
        },
        autoCalculateStatus: true,
        hp: { current: 36, max: 36 },
        energy: { current: 15, max: 15 },
        sanity: { current: 32, max: 32 },
        determination: 4,
        defense: 16,
        initiative: 8,
        speed: '9m',
        skills: [
            { name: 'Pontaria', key: 'pontaria', attributeKey: 'AGI', training: 'veterano', customBonus: 0, total: 10 },
            { name: 'Investigação', key: 'investigacao', attributeKey: 'INT', training: 'veterano', customBonus: 2, total: 12 },
            { name: 'Percepção', key: 'percepcao', attributeKey: 'PRE', training: 'treinado', customBonus: 0, total: 5 },
            { name: 'Furtividade', key: 'furtividade', attributeKey: 'AGI', training: 'treinado', customBonus: 0, total: 5 },
            { name: 'Crime', key: 'crime', attributeKey: 'AGI', training: 'treinado', customBonus: 0, total: 5 },
            { name: 'Ocultismo', key: 'ocultismo', attributeKey: 'INT', training: 'treinado', customBonus: 0, total: 5 },
            { name: 'Reflexos', key: 'reflexos', attributeKey: 'AGI', training: 'treinado', customBonus: 0, total: 5 },
            { name: 'Vontade', key: 'vontade', attributeKey: 'PRE', training: 'treinado', customBonus: 0, total: 5 }
        ],
        token: {
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
            scale: 1.0,
            isAnimated: false
        },
        biography: 'Ex-perito da polícia civil que descobriu relatórios ufológicos arquivados e foi contatado pelos agentes da Ordem.',
        items: [
            {
                id: 'item-1',
                name: 'Rifle de Precisão .308',
                category: 'Arma',
                subcategory: 'Arma de Fogo / Duas Mãos',
                description: 'Rifle tático com mira holográfica e silenciador removível.',
                equipped: true,
                quantity: 1,
                weight: 2,
                price: 1500,
                currencyUnit: 'Créditos',
                showInDiceRolls: true,
                passiveBonuses: [],
                actions: [
                    {
                        id: 'act-1',
                        name: 'Disparo Mirado',
                        type: 'attack',
                        formula: '2d10 + @AGI',
                        criticalMargin: 19,
                        criticalMultiplier: 3,
                        range: 'Longo (30m)',
                        targetStatusAffected: 'hp'
                    }
                ]
            },
            {
                id: 'item-2',
                name: 'Vestimenta Reforçada',
                category: 'Armadura',
                description: 'Colete de kevlar oculto sob sobretudo preto.',
                equipped: true,
                quantity: 1,
                weight: 1,
                price: 800,
                showInDiceRolls: false,
                passiveBonuses: [{ statKey: 'defense', value: 2 }],
                actions: []
            }
        ],
        abilities: [
            {
                id: 'ab-1',
                name: 'Mira de Elite',
                originType: 'Habilidade de Classe',
                description: 'Você ignora penalidades de cobertura leve e soma Intelecto na margem de dano.',
                isReaction: false,
                showDescriptionInChat: true,
                cost: { energyPoints: 2, actionType: 'Movimento' },
                passiveBonuses: [],
                actions: [
                    {
                        id: 'act-mira',
                        name: 'Dano Adicional de Elite',
                        formula: '1d6 + @INT',
                        testType: 'sem_teste',
                        targetStatus: 'hp',
                        isHealing: false
                    }
                ]
            },
            {
                id: 'ab-2',
                name: 'Faro para Pistas',
                originType: 'Poder de Origem',
                description: 'Gaste 1 PE para receber +5 em um teste de investigação.',
                isReaction: false,
                showDescriptionInChat: true,
                cost: { energyPoints: 1, actionType: 'Livre' },
                passiveBonuses: [],
                actions: []
            }
        ],
        coins: 450,
        currencyUnit: 'Créditos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'char-thorgrim',
        name: 'Thorgrim Punho-de-Ferro',
        systemId: 'dnd-5e-2014',
        ownerType: 'player',
        assignedUser: 'ThiSBernardo',
        campaignId: 'camp-2',
        folder: 'A Maldição de Strahd',
        characterClass: 'Guerreiro',
        subclass: 'Campeão',
        levelOrNex: 3,
        raceOrAncestry: 'Anão da Colina',
        originOrBackground: 'Soldado',
        attributes: {
            FOR: 16,
            DES: 12,
            CON: 16,
            INT: 10,
            SAB: 14,
            CAR: 8
        },
        autoCalculateStatus: true,
        hp: { current: 34, max: 34 },
        defense: 18, // Cota de malha + Escudo
        initiative: 1,
        speed: '7.5m',
        savingThrowProficiencies: ['FOR', 'CON'],
        skills: [
            { name: 'Atletismo', key: 'athletics', attributeKey: 'FOR', training: 'treinado', customBonus: 0, total: 5 },
            { name: 'Intimidação', key: 'intimidation', attributeKey: 'CAR', training: 'treinado', customBonus: 0, total: 1 },
            { name: 'Percepção', key: 'perception', attributeKey: 'SAB', training: 'treinado', customBonus: 0, total: 4 },
            { name: 'Sobrevivência', key: 'survival', attributeKey: 'SAB', training: 'treinado', customBonus: 0, total: 4 }
        ],
        token: {
            imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop',
            scale: 1.0
        },
        biography: 'Veterano das guerras subterrâneas contra os duergars. Não recua diante de nenhum horror.',
        items: [
            {
                id: 'item-dnd-1',
                name: 'Machado de Batalha',
                category: 'Arma',
                description: 'Forjado com aço anão ancestrais.',
                equipped: true,
                quantity: 1,
                weight: 2,
                price: 15,
                currencyUnit: 'PO',
                showInDiceRolls: true,
                passiveBonuses: [],
                actions: [
                    {
                        id: 'dnd-act-1',
                        name: 'Golpe com Machado',
                        type: 'attack',
                        formula: '1d8 + 3',
                        criticalMargin: 19, // Campeão tem crítico 19-20!
                        range: 'Corpo a corpo',
                        targetStatusAffected: 'hp'
                    }
                ]
            }
        ],
        abilities: [
            {
                id: 'dnd-ab-1',
                name: 'Retomar o Fôlego (Second Wind)',
                originType: 'Habilidade de Classe',
                description: 'Recupere 1d10 + nível em pontos de vida como ação bônus.',
                isReaction: false,
                showDescriptionInChat: true,
                cost: { energyPoints: 0, actionType: 'Livre' },
                passiveBonuses: [],
                actions: [
                    {
                        id: 'dnd-act-heal',
                        name: 'Cura do Segundo Vento',
                        formula: '1d10 + 3',
                        testType: 'sem_teste',
                        targetStatus: 'hp',
                        isHealing: true
                    }
                ]
            }
        ],
        coins: 85,
        currencyUnit: 'PO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
// Seed Campaigns
const INITIAL_CAMPAIGNS = [
    {
        id: 'camp-test-mapping',
        title: 'Campanha de Teste Mapeamento',
        synopsis: 'Mapeamento detalhado das manifestações do Outro Lado e rituais arcanos.',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        systemId: 'ordem-paranormal',
        masterId: 'user-thiago',
        masterName: 'ThisBernardo',
        masterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
        isMasterOnline: true,
        isPublic: true,
        requiresApproval: true,
        maxPlayers: 5,
        genres: ['Investigação', 'Terror'],
        playStyles: ['Voz', 'Discord'],
        isSessionActive: true,
        sessionsHistory: [
            { id: 'sess-test-old', date: 'Hoje', time: '14:00', durationHours: 3 }
        ],
        participants: [
            {
                userId: 'user-thiago',
                userName: 'ThisBernardo',
                userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
                role: 'master',
                isOnline: true
            }
        ],
        chronicle: [],
        inviteCode: 'TESTMAP',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-crystal-lake',
        title: 'O VERÃO EM CRYSTAL LAKE',
        synopsis: 'Um acampamento isolado nas montanhas esconde um passado sangrento. Sobreviva à temporada.',
        coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop',
        systemId: 'dnd-5e-2014',
        masterId: 'master-jason',
        masterName: 'JasonM',
        masterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        isMasterOnline: true,
        isPublic: true,
        requiresApproval: true,
        maxPlayers: 5,
        genres: ['Terror', 'Sobrevivência'],
        playStyles: ['Voz', 'Discord', 'Imersão Total'],
        isSessionActive: false,
        nextSession: {
            id: 'sess-cl',
            date: 'Em 3 dias',
            time: '20:00',
            durationHours: 3.5,
            recurrence: 'weekly'
        },
        sessionsHistory: [],
        participants: [],
        chronicle: [],
        inviteCode: 'CRYSTAL-LAKE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-peso-tempo',
        title: 'O PESO DO TEMPO',
        synopsis: 'Em uma cidade esquecida, cada badalada do relógio cobra um preço dos vivos.',
        coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
        systemId: 'ordem-paranormal',
        masterId: 'master-chronos',
        masterName: 'Chronos',
        masterAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
        isMasterOnline: true,
        isPublic: true,
        requiresApproval: true,
        maxPlayers: 4,
        genres: ['Suspense', 'Terror'],
        playStyles: ['Voz', 'Investigação'],
        isSessionActive: false,
        nextSession: {
            id: 'sess-pt',
            date: 'Data a definir',
            time: '19:00',
            durationHours: 4,
            recurrence: 'weekly'
        },
        sessionsHistory: [],
        participants: [],
        chronicle: [],
        inviteCode: 'PESO-TEMPO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-reinos-aventura',
        title: 'CRÔNICAS SOMBRIA.D&D',
        synopsis: 'Reinos em colapso enfrentam criaturas ancestrais em busca de um artefato lendário.',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
        systemId: 'dnd-5e-2014',
        masterId: 'master-dnd',
        masterName: 'DungeonMaster',
        masterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        isMasterOnline: true,
        isPublic: true,
        requiresApproval: true,
        maxPlayers: 5,
        genres: ['Suspense', 'Dark Fantasy'],
        playStyles: ['Voz', 'Alta Dificuldade'],
        isSessionActive: false,
        nextSession: {
            id: 'sess-ra',
            date: 'Sessão passada',
            time: '21:00',
            durationHours: 4,
            recurrence: 'weekly'
        },
        sessionsHistory: [],
        participants: [],
        chronicle: [],
        inviteCode: 'CRONICAS-DND',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-estrada',
        title: 'UMA ESTRADA POSSIVELMENTE MORTAL',
        synopsis: 'Uma viagem sem volta por uma rodovia interditada onde aberrações aguardam na névoa.',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        systemId: 'ordem-paranormal',
        masterId: 'master-estrada',
        masterName: 'Condutor',
        masterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        isMasterOnline: false,
        isPublic: true,
        requiresApproval: true,
        maxPlayers: 6,
        genres: ['Sobrevivência', 'Pós-Apocalíptico'],
        playStyles: ['Voz', 'Sobrevivência'],
        isSessionActive: false,
        nextSession: {
            id: 'sess-es',
            date: 'Data a definir',
            time: '20:00',
            durationHours: 3,
            recurrence: 'weekly'
        },
        sessionsHistory: [],
        participants: [],
        chronicle: [],
        inviteCode: 'ESTRADA-MORTAL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-teste',
        title: 'TESTE',
        synopsis: 'Mesa experimental para teste de mecânicas narrativas e combate tático.',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        systemId: 'ficha-universal',
        masterId: 'master-teste',
        masterName: 'Avaliador',
        masterAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop',
        isMasterOnline: false,
        isPublic: true,
        requiresApproval: false,
        maxPlayers: 4,
        genres: ['Dark Fantasy', 'Sobrevivência'],
        playStyles: ['Texto', 'Casual'],
        isSessionActive: false,
        nextSession: {
            id: 'sess-t',
            date: 'Data a definir',
            time: '18:00',
            durationHours: 2,
            recurrence: 'weekly'
        },
        sessionsHistory: [],
        participants: [],
        chronicle: [],
        inviteCode: 'TESTE-MESA',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-sexta-feira',
        title: 'SEXTA FEIRA',
        synopsis: 'Lendas urbanas e rituais perigosos na calada da noite.',
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
        systemId: 'ordem-paranormal',
        masterId: 'master-sexta',
        masterName: 'Nocturno',
        masterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isMasterOnline: true,
        isPublic: true,
        requiresApproval: true,
        maxPlayers: 5,
        genres: ['Sobrevivência', 'Mitologia'],
        playStyles: ['Voz', 'Gore'],
        isSessionActive: false,
        nextSession: {
            id: 'sess-sf',
            date: 'Data a definir',
            time: '21:00',
            durationHours: 3.5,
            recurrence: 'weekly'
        },
        sessionsHistory: [],
        participants: [],
        chronicle: [],
        inviteCode: 'SEXTA-FEIRA',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-1',
        title: 'O Segredo da Floresta Sombria',
        synopsis: 'Estranhos desaparecimentos na serra gaúcha levam uma equipe de agentes a investigar uma antiga vila abandonada envolvida por uma névoa espessa e símbolos de Sangue.',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        systemId: 'ordem-paranormal',
        masterId: 'user-thiago',
        masterName: 'ThiSBernardo',
        masterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
        isMasterOnline: true,
        isPublic: true,
        requiresApproval: true,
        maxPlayers: 5,
        genres: ['Terror', 'Investigação', 'Suspense', 'Dark Fantasy'],
        playStyles: ['Voz', 'Discord', 'Imersão Total', 'Campanha Longa'],
        isSessionActive: true,
        nextSession: {
            id: 'sess-1',
            date: 'Amanhã',
            time: '20:00',
            durationHours: 3.5,
            notes: 'Investigação do porão da igreja de São Judas.',
            recurrence: 'weekly'
        },
        sessionsHistory: [
            { id: 'sess-old-1', date: '04/11/2026', time: '20:00', durationHours: 4 }
        ],
        participants: [
            {
                userId: 'user-thiago',
                userName: 'ThiSBernardo',
                userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
                role: 'master',
                isOnline: true
            },
            {
                userId: 'p1',
                userName: 'Gabriel Lima',
                userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
                role: 'player',
                characterId: 'char-arthur',
                characterName: 'Arthur Veríssimo',
                isOnline: true
            },
            {
                userId: 'p2',
                userName: 'Mariana Duarte',
                userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
                role: 'player',
                characterName: 'Dra. Clara Silveira',
                isOnline: false
            }
        ],
        chronicle: [
            {
                id: 'chron-1',
                title: 'Capítulo 1 — A Chegada ao Vale dos Pinheiros',
                date: '04/11/2026',
                summary: 'Os agentes chegaram à cidade sob chuva torrencial e encontraram a delegacia revirada.',
                content: 'Ao chegarem no Vale dos Pinheiros, os agentes se depararam com as ruas desertas...'
            }
        ],
        inviteCode: 'DARK-FOREST-77',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-2',
        title: 'A Maldição de Strahd',
        synopsis: 'Nas terras amaldiçoadas de Baróvia, os aventureiros precisam desvendar os segredos do Castelo Ravenloft e enfrentar o senhor vampiro Strahd von Zarovich.',
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
        systemId: 'dnd-5e-2014',
        masterId: 'f1',
        masterName: 'Gabriel Lima',
        masterAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
        isMasterOnline: true,
        isPublic: true,
        requiresApproval: true,
        maxPlayers: 6,
        genres: ['Gótico', 'Dark Fantasy', 'Horror'],
        playStyles: ['Voz', 'Com Gore', 'Alta Dificuldade'],
        isSessionActive: false,
        nextSession: {
            id: 'sess-strahd',
            date: 'Sábado',
            time: '19:00',
            durationHours: 4,
            recurrence: 'weekly'
        },
        sessionsHistory: [],
        participants: [
            {
                userId: 'user-thiago',
                userName: 'ThiSBernardo',
                userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
                role: 'player',
                characterId: 'char-thorgrim',
                characterName: 'Thorgrim Punho-de-Ferro',
                isOnline: true
            }
        ],
        chronicle: [],
        inviteCode: 'RAVENLOFT-666',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'camp-3',
        title: 'Cavaleiros dos 8 Reinos',
        synopsis: 'Um torneio de justas se transforma em conspiração imperial quando o rei adoece misteriosamente.',
        coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
        systemId: 'ficha-universal',
        masterId: 'user-random-1',
        masterName: 'Sir Galahad',
        masterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        isMasterOnline: false,
        isPublic: true,
        requiresApproval: false,
        maxPlayers: 4,
        genres: ['Fantasia Clássica', 'Intriga Política'],
        playStyles: ['Texto', 'Casual'],
        isSessionActive: false,
        sessionsHistory: [],
        participants: [],
        chronicle: [],
        inviteCode: 'REINOS-8',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
// Seed Guilds
const INITIAL_GUILDS = [
    {
        id: 'guild-darkage',
        name: 'Dark Age',
        tag: 'DARK',
        description: 'Guilda Oficial do Dark Age RPG',
        crestIcon: 'Castle',
        bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        themeColor: '#8b5cf6',
        accessType: 'convite',
        isVerified: true,
        memberCount: 6,
        campaignsCount: 1,
        leaderId: 'leader-darkage',
        leaderName: 'Dark Age Staff',
        rules: 'Guilda oficial de anúncios, suporte e eventos do sistema.',
        isMember: false
    },
    {
        id: 'guild-samsara',
        name: 'SAMSARA',
        tag: 'SMSR',
        description: 'SAMSARA Japão, Era Edo. Entre samurais, clãs e feiticeiros, o mundo mortal divide espaço com yokais, dragões, elfos e criaturas ancestrais. Além dele, existem planos onde o impossível se torna realidade: o Reino Feérico, Plano Astral, Abismo, Infernos e muitos outros. Explore, investigue e...',
        crestIcon: 'Shield',
        bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
        themeColor: '#334155',
        accessType: 'aprovacao',
        isVerified: true,
        memberCount: 8,
        campaignsCount: 1,
        leaderId: 'leader-samsara',
        leaderName: 'Kenshin',
        rules: 'Respeito à temática e participação ativa nas campanhas.',
        isMember: false
    },
    {
        id: 'guild-conclave',
        name: 'RPG | Conclave De Distúrbios Mentais...',
        tag: 'CDMP',
        description: 'O RPG | Conclave de Distúrbios Mentais Psicodélicos Superficial Imaginário em Conjunto nasceu de um simples grupo de amigos que compartilhavam o mesmo gosto por histórias, personagens e, principalmente, pela vontade de criar algo juntos. Com o tempo, aquilo que...',
        crestIcon: 'Dices',
        bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
        themeColor: '#dc2626',
        accessType: 'convite',
        isVerified: false,
        memberCount: 2,
        campaignsCount: 0,
        leaderId: 'leader-conclave',
        leaderName: 'Mestre Caos',
        rules: 'Narrativas experimentais e horror cósmico.',
        isMember: false
    },
    {
        id: 'guild-valhalla',
        name: 'Valhalla',
        tag: 'VAL',
        description: 'Bem-vindo',
        crestIcon: 'Castle',
        bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        themeColor: '#6d28d9',
        accessType: 'convite',
        isVerified: false,
        memberCount: 1,
        campaignsCount: 0,
        leaderId: 'leader-valhalla',
        leaderName: 'Odin',
        rules: 'Honra e coragem nas mesas.',
        isMember: false
    },
    {
        id: 'guild-iniciando',
        name: 'iniciando',
        tag: 'INI',
        description: 'nunca joguei um rpg mais sempre tive vontade de aprender mas n tenho amigos para jogar entao quem quiser jogar e me ensinar estamos ai kkkkkkkk',
        crestIcon: 'Users',
        bannerImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
        themeColor: '#b45309',
        accessType: 'livre',
        isVerified: false,
        memberCount: 24,
        campaignsCount: 0,
        leaderId: 'leader-novato',
        leaderName: 'Player1',
        rules: 'Paciência com novatos e foco no aprendizado.',
        isMember: false
    }
];
// Seed Shop
const INITIAL_SHOP_ITEMS = [
    {
        id: 'shop-borda-dragao',
        title: 'Borda Dragão Ancestral',
        category: 'Bordas',
        priceCoins: 590,
        priceReal: 5.90,
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=400&auto=format&fit=crop',
        isOfficial: true,
        isFeatured: true
    },
    {
        id: 'shop-borda-solar',
        title: 'Borda Coroa Solar',
        category: 'Bordas',
        priceCoins: 590,
        priceReal: 5.90,
        imageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=400&auto=format&fit=crop',
        isOfficial: true
    },
    {
        id: 'shop-dados-obsidiana',
        title: 'Dados 3D de Obsidiana e Sangue',
        category: 'Dados',
        priceCoins: 890,
        priceReal: 8.90,
        imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop',
        isOfficial: true,
        isFeatured: true
    },
    {
        id: 'shop-dados-ametista',
        title: 'Dados 3D Ametista Cósmica',
        category: 'Dados',
        priceCoins: 890,
        priceReal: 8.90,
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop',
        isOfficial: true
    }
];
export const SUBSCRIPTION_PLANS = [
    {
        id: 'explorador',
        name: 'Explorador',
        priceMonthly: 0,
        badgeText: 'Gratuito',
        cloudStorage: '200 MB',
        maxCampaigns: 3,
        features: [
            'Até 3 campanhas ativas',
            '200 MB de armazenamento de mídias',
            'Fichas de personagens ilimitadas',
            'Acesso à mesa virtual básica',
            'Biblioteca pessoal'
        ]
    },
    {
        id: 'duque',
        name: 'Duque',
        priceMonthly: 15.92,
        priceAnnually: 159.90,
        badgeText: 'Mais Popular',
        cloudStorage: '5 GB',
        maxCampaigns: 10,
        features: [
            'Até 10 campanhas ativas',
            '5 GB de armazenamento em nuvem',
            'Dados 3D e Ateliê desbloqueados',
            'Efeitos climáticos na mesa virtual',
            'Banner customizado em Guildas',
            'Cargo exclusivo no Discord Oficial'
        ]
    },
    {
        id: 'arquiduque',
        name: 'Arquiduque',
        priceMonthly: 31.92,
        priceAnnually: 319.90,
        badgeText: 'Apoiador Supremo',
        cloudStorage: '10 GB',
        maxCampaigns: 999,
        features: [
            'Campanhas ilimitadas',
            '10 GB de armazenamento de alta velocidade',
            'Acesso antecipado a novos sistemas e playtests',
            'Gerador de arte com IA estendido',
            'Suporte prioritário da equipe',
            'Todas as bordas e cosméticos liberados'
        ]
    }
];
export class StorageService {
    static getUser() {
        const raw = localStorage.getItem(STORAGE_KEYS.USER);
        if (!raw) {
            this.saveUser(INITIAL_USER);
            return INITIAL_USER;
        }
        try {
            return JSON.parse(raw);
        }
        catch {
            return INITIAL_USER;
        }
    }
    static saveUser(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    static getCharacters() {
        const raw = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
        if (!raw) {
            this.saveCharacters(INITIAL_CHARACTERS);
            return INITIAL_CHARACTERS;
        }
        try {
            return JSON.parse(raw);
        }
        catch {
            return INITIAL_CHARACTERS;
        }
    }
    static saveCharacters(chars) {
        localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(chars));
    }
    static getCharacterById(id) {
        return this.getCharacters().find(c => c.id === id);
    }
    static saveCharacter(char) {
        const chars = this.getCharacters();
        const idx = chars.findIndex(c => c.id === char.id);
        if (idx >= 0) {
            chars[idx] = { ...char, updatedAt: new Date().toISOString() };
        }
        else {
            chars.unshift({ ...char, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        }
        this.saveCharacters(chars);
    }
    static deleteCharacter(id) {
        const chars = this.getCharacters().filter(c => c.id !== id);
        this.saveCharacters(chars);
    }
    static getCampaigns() {
        const raw = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
        if (!raw) {
            this.saveCampaigns(INITIAL_CAMPAIGNS);
            return INITIAL_CAMPAIGNS;
        }
        try {
            const parsed = JSON.parse(raw);
            if (!parsed.some(c => c.id === 'camp-test-mapping')) {
                const foundTest = INITIAL_CAMPAIGNS.find(c => c.id === 'camp-test-mapping');
                if (foundTest) {
                    parsed.unshift(foundTest);
                    this.saveCampaigns(parsed);
                }
            }
            return parsed;
        }
        catch {
            return INITIAL_CAMPAIGNS;
        }
    }
    static saveCampaigns(camps) {
        localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(camps));
    }
    static getCampaignById(id) {
        return this.getCampaigns().find(c => c.id === id);
    }
    static saveCampaign(campaign) {
        const list = this.getCampaigns();
        const idx = list.findIndex(c => c.id === campaign.id);
        if (idx >= 0) {
            list[idx] = { ...campaign, updatedAt: new Date().toISOString() };
        }
        else {
            list.unshift({ ...campaign, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        }
        this.saveCampaigns(list);
    }
    static getGuilds() {
        const raw = localStorage.getItem(STORAGE_KEYS.GUILDS);
        if (!raw) {
            this.saveGuilds(INITIAL_GUILDS);
            return INITIAL_GUILDS;
        }
        try {
            const parsed = JSON.parse(raw);
            if (!parsed.some(g => g.id === 'guild-darkage')) {
                this.saveGuilds(INITIAL_GUILDS);
                return INITIAL_GUILDS;
            }
            return parsed;
        }
        catch {
            return INITIAL_GUILDS;
        }
    }
    static saveGuilds(guilds) {
        localStorage.setItem(STORAGE_KEYS.GUILDS, JSON.stringify(guilds));
    }
    static getShopItems() {
        const raw = localStorage.getItem(STORAGE_KEYS.SHOP);
        if (!raw) {
            this.saveShopItems(INITIAL_SHOP_ITEMS);
            return INITIAL_SHOP_ITEMS;
        }
        try {
            return JSON.parse(raw);
        }
        catch {
            return INITIAL_SHOP_ITEMS;
        }
    }
    static saveShopItems(items) {
        localStorage.setItem(STORAGE_KEYS.SHOP, JSON.stringify(items));
    }
    static getDiceRolls() {
        const raw = localStorage.getItem(STORAGE_KEYS.ROLLS);
        if (!raw)
            return [];
        try {
            return JSON.parse(raw);
        }
        catch {
            return [];
        }
    }
    static addDiceRoll(roll) {
        const rolls = this.getDiceRolls();
        rolls.unshift(roll);
        if (rolls.length > 50)
            rolls.pop();
        localStorage.setItem(STORAGE_KEYS.ROLLS, JSON.stringify(rolls));
    }
    static getPublicProfile(userCode) {
        return {
            id: 'user-valkyrie',
            name: 'Helena "Valkyrie" Frost',
            friendCode: userCode || 'VALK990',
            discordTag: 'Valkyrie#4412',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
            bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
            titleBadge: 'Aprendiz do Nyx',
            bio: 'Adoro interpretar guerreiras nórdicas e investigadoras forenses. Jogo sério com imersão total.',
            likesCount: 142,
            campaignsCount: 8,
            charactersCount: 14,
            chatMessagesCount: 1250,
            diceRollsCount: 5170,
            badges: [
                { id: 'b1', name: 'Arquiduque', icon: '👑', rarity: 'lendário' },
                { id: 'b2', name: 'D20 Ouro Halloween', icon: '🎃', rarity: 'raro' },
                { id: 'b3', name: 'Marco Zero', icon: '⚡', rarity: 'mítico' },
                { id: 'b4', name: 'Pioneiro', icon: '🛡️', rarity: 'incomum' },
            ],
            rpgDna: [
                { genre: 'Mistério & Investigação', percentage: 92, color: '#8b5cf6' },
                { genre: 'Terror Cósmico', percentage: 88, color: '#06b6d4' },
                { genre: 'Dark Fantasy', percentage: 78, color: '#f59e0b' },
                { genre: 'Roleplay Intenso', percentage: 85, color: '#ec4899' },
                { genre: 'Combate Tático', percentage: 65, color: '#ef4444' },
            ],
            favoriteSystem: {
                name: 'Ordem Paranormal',
                poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
                badge: 'Oficial'
            },
            currentCampaign: {
                title: 'O Segredo da Floresta Sombria',
                system: 'Ordem Paranormal',
                role: 'Investigadora Forense',
                cover: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=600&auto=format&fit=crop'
            },
            guild: {
                name: 'Os Guardiões do Véu',
                tag: 'VEU',
                color: '#8b5cf6',
                memberCount: 38
            },
            characters: [
                {
                    id: 'c1',
                    name: 'Dra. Astrid Lindgren',
                    className: 'Especialista / Médica',
                    levelOrNex: 'NEX 25%',
                    system: 'Ordem Paranormal',
                    cutoutImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
                    fullArt: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop'
                },
                {
                    id: 'c2',
                    name: 'Ivar Braço-de-Ferro',
                    className: 'Combatente / Guerreiro',
                    levelOrNex: 'NEX 40%',
                    system: 'Ordem Paranormal',
                    cutoutImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
                    fullArt: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop'
                }
            ]
        };
    }
}
