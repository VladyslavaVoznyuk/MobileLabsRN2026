export const NEWS_DATA = [
  { id: '1', title: 'Українські вчені розробили новий вид батареї',      description: 'Науковці КПІ представили акумулятор нового покоління, який заряджається за 5 хвилин і тримає заряд тиждень. Технологія вже зацікавила міжнародних партнерів.',   image: 'https://picsum.photos/seed/n1/600/300', category: 'Наука',      author: 'Іван Петренко',  date: '01.05.2025' },
  { id: '2', title: 'У Львові відкрили новий IT-парк',                    description: 'Сучасний технологічний кампус розрахований на 2000 розробників. У будівлі є коворкінги, лабораторії та освітні простори для студентів.',                          image: 'https://picsum.photos/seed/n2/600/300', category: 'Технології', author: 'Олена Коваль',   date: '02.05.2025' },
  { id: '3', title: 'Київський марафон: рекордна кількість учасників',    description: 'Цьогоріч у марафоні взяли участь понад 12 000 спортсменів з 40 країн. Переможець подолав дистанцію за 2 години 11 хвилин.',                                      image: 'https://picsum.photos/seed/n3/600/300', category: 'Спорт',      author: 'Андрій Мельник', date: '03.05.2025' },
  { id: '4', title: 'Фестиваль вуличного мистецтва в Одесі',              description: 'Понад 50 художників з усього світу розмалювали фасади будинків у центрі міста. Фестиваль тривав три дні і зібрав тисячі глядачів.',                               image: 'https://picsum.photos/seed/n4/600/300', category: 'Культура',   author: 'Марія Бойко',    date: '04.05.2025' },
  { id: '5', title: 'Уряд підтримає 500 стартапів цього року',            description: 'Програма державної підтримки надасть гранти до 500 тисяч гривень молодим підприємцям у сфері IT, агро та медицини.',                                              image: 'https://picsum.photos/seed/n5/600/300', category: 'Економіка',  author: 'Тарас Лисенко',  date: '05.05.2025' },
];

let _id = NEWS_DATA.length + 1;
export const generateMore = (count = 3) =>
  Array.from({ length: count }, () => {
    const id = String(_id++);
    return { id, title: 'Нова новина #' + id, description: 'Автоматично згенерована новина для Infinite Scroll. Дані підвантажуються при досягненні кінця списку.', image: 'https://picsum.photos/seed/e' + id + '/600/300', category: 'Загальне', author: 'Редакція', date: '2026' };
  });

export const CONTACTS_DATA = [
  { title: 'Керівництво', data: [
    { id: 'c1', name: 'Ольга Василенко',  role: 'Головний редактор',  phone: '+380 44 100-00-01', avatar: 'https://img.freepik.com/premium-vector/avatar-profile-vector-illustrations-website-social-networks-user-profile-icon_495897-224.jpg?w=360'  },
    { id: 'c2', name: 'Богдан Кравченко', role: 'Технічний директор', phone: '+380 44 100-00-02', avatar: 'https://img.freepik.com/premium-vector/avatar-profile-vector-illustrations-website-social-networks-user-profile-icon_495897-223.jpg'  },
  ]},
  { title: 'Редакція', data: [
    { id: 'c3', name: 'Марія Сидоренко', role: 'Журналіст',         phone: '+380 44 200-00-01', avatar: 'https://png.pngtree.com/png-clipart/20230930/original/pngtree-friendly-female-avatar-for-website-and-social-network-vector-png-image_12917752.png'  },
    { id: 'c4', name: 'Павло Романенко', role: 'Репортер',          phone: '+380 44 200-00-02', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMIV4G1cOkMqLJOprbYZ0gdMGZ3SaIguSmkg&s'  },
    { id: 'c5', name: 'Юлія Мороз',      role: 'Фотокореспондент', phone: '+380 44 200-00-03', avatar: 'https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg?semt=ais_rp_progressive&w=740&q=80'  },
  ]},
  { title: 'Розробка', data: [
    { id: 'c6', name: 'Олексій Гриценко', role: 'Frontend розробник', phone: '+380 44 300-00-01', avatar: 'https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495273.png' },
    { id: 'c7', name: 'Вікторія Лисенко', role: 'Backend розробник',  phone: '+380 44 300-00-02', avatar: 'https://cdn-icons-png.flaticon.com/512/4113/4113036.png' },
  ]},
];
