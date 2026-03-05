#  Лабораторна робота №2

---

## Інструкція запуску

### 1. Встановити Node.js та Expo CLI
Завантажити Node.js з [nodejs.org](https://nodejs.org) (версія 18+).

### 2. Створити проєкт
```bash
npx create-expo-app@latest NewsApp --template blank
cd NewsApp
```

### 3. Встановити залежності
```bash
npm install
```

### 5. Запустити проєкт
```bash
npx expo start
```

### 6. Відкрити на телефоні
- Встановити додаток **Expo Go** (App Store / Google Play)
- **iOS:** відсканувати QR-код камерою
- **Android:** натиснути "Scan QR code" в Expo Go

## Опис реалізованого функціоналу

### Модель даних (`src/data/newsData.js`)
Масив `NEWS_DATA` із 5 новин. Кожен об'єкт містить обов'язкові поля:
- `id` — унікальний ідентифікатор
- `title` — заголовок новини
- `description` — опис
- `image` — URL зображення
- `category`, `author`, `date` — додаткові поля

Функція `generateMore()` генерує нові об'єкти для Infinite Scroll.  
Масив `CONTACTS_DATA` містить секції контактів для SectionList.

---

### Головний екран — FlatList (`src/screens/MainScreen.js`)

**Pull-to-Refresh** — імітація мережевого запиту через `setTimeout` (1500мс):
```js
const onRefresh = useCallback(() => {
  setRefreshing(true);
  setTimeout(() => {
    setNews(NEWS_DATA);
    setRefreshing(false);
  }, 1500);
}, []);
```

**Infinite Scroll** — підвантаження 3 нових новин при досягненні кінця:
```js
onEndReached={onEndReached}
onEndReachedThreshold={0.5}
```

**Візуальні компоненти:**
- `ListHeaderComponent` — заголовок "Новини" над списком
- `ListFooterComponent` — індикатор завантаження (`ActivityIndicator`)
- `ItemSeparatorComponent` — відступ між картками

**Оптимізація рендерингу:**
```js
initialNumToRender={5}
maxToRenderPerBatch={5}
windowSize={10}
```

---

### Навігація (`src/navigation/AppNavigator.js`)

- Перехід між екранами: `navigation.navigate('DetailsScreen', { newsItem: item })`
- Передача параметрів: `route.params.newsItem`
- Динамічний заголовок у DetailsScreen через `useLayoutEffect`
- Усунення подвійного header-а: `headerShown: false` у Drawer Navigator

---

### Екран деталей (`src/screens/DetailsScreen.js`)

Відображає повний текст новини. Заголовок хедера встановлюється динамічно:
```js
useLayoutEffect(() => {
  navigation.setOptions({ title: newsItem.category });
}, [navigation, newsItem]);
```

---

### Екран контактів — SectionList (`src/screens/ContactsScreen.js`)

Реалізовано з усіма обов'язковими пропсами:
```js
<SectionList
  sections={CONTACTS_DATA}
  renderItem={({ item }) => ...}
  renderSectionHeader={({ section }) => ...}
  keyExtractor={item => item.id}
  ItemSeparatorComponent={() => ...}
/>
```
Дані розбиті на 3 секції: **Керівництво**, **Редакція**, **Розробка**.

---

## Скріншоти

Головна сторінка з новинами ![mainnews.jpg](assets%2Fscreens%2Fmainnews.jpg)
Деталі новини![detailsnews.jpg](assets%2Fscreens%2Fdetailsnews.jpg)
Контакти![contacts.jpg](assets%2Fscreens%2Fcontacts.jpg)
Меню з особистою інформацією![drawer.jpg](assets%2Fscreens%2Fdrawer.jpg)

## Висновки

### Відповіді на контрольні запитання

**1. Чим відрізняється FlatList від ScrollView?**

`ScrollView` рендерить усі елементи одразу при монтуванні компонента, що призводить до великого споживання пам'яті при великих списках. `FlatList` використовує **віртуалізацію** — рендерить лише ті елементи, які видно на екрані, і знищує елементи поза межами видимості. Завдяки цьому `FlatList` ефективніший для списків будь-якого розміру, особливо великих, а також підтримує вбудований pull-to-refresh, infinite scroll та оптимізаційні параметри.

---

**2. Що таке віртуалізація списків?**

Віртуалізація — це техніка оптимізації, при якій у DOM/native tree одночасно знаходяться лише елементи, видимі у поточному вікні перегляду (viewport), плюс невеликий буфер поруч. Елементи, що виходять за межі `windowSize`, демонтуються і звільняють пам'ять. При прокрутці елементи динамічно монтуються і демонтуються. У React Native це реалізовано у компонентах `FlatList`, `SectionList` та `VirtualizedList` через параметри `initialNumToRender`, `maxToRenderPerBatch` і `windowSize`.

---

**3. Як здійснюється передача параметрів між екранами?**

Параметри передаються другим аргументом функції `navigate`:
```js
// Відправник
navigation.navigate('DetailsScreen', { newsItem: item });

// Отримувач
const { newsItem } = route.params;
```
Об'єкт `route.params` містить всі передані параметри. Для зміни заголовка на основі параметрів використовується `navigation.setOptions()` всередині `useLayoutEffect`.

---

**4. Що таке вкладена навігація?**

Вкладена навігація — це розміщення одного навігатора всередині екрану іншого навігатора. У цьому проєкті `Stack Navigator` вкладено всередину `Drawer Navigator`. Це дозволяє комбінувати різні типи навігації: бокове меню (Drawer) керує переходом між розділами застосунку, а Stack Navigator — переходами між екранами всередині розділу "Новини". Важливо уникати подвійного header-а через `headerShown: false` у зовнішньому навігаторі.

---

**5. У яких випадках застосовується SectionList?**

`SectionList` застосовується коли дані природньо розбиті на іменовані групи (секції): контакти за алфавітом або відділами, налаштування за категоріями, повідомлення за датами, товари за категоріями тощо. На відміну від `FlatList`, `SectionList` підтримує `renderSectionHeader` — заголовок для кожної групи, який може бути "липким" (`stickySectionHeadersEnabled`). У цьому проєкті `SectionList` використано для відображення контактів, розбитих на секції: Керівництво, Редакція, Розробка.
