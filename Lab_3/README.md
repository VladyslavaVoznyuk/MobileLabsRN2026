# Лабораторна робота №3

## Встановлення

```bash
npm install

npm start
```
## Скріншоти роботи програми
1. Головний екран:![img.png](screen%2Fimg.png)
2. Сторінка із завданнями:![img_1.png](screen%2Fimg_1.png)
3. Сторінка налаштувань![img_2.png](screen%2Fimg_2.png)

## Використані бібліотеки

| Бібліотека | Призначення |
|---|---|
| `react-native-gesture-handler` | Всі жести (Tap, LongPress, Pan, Fling, Pinch) |
| `react-native-reanimated` | Плавні анімації кнопки |
| `@react-navigation/native` | Навігація між екранами |
| `@react-navigation/bottom-tabs` | Нижня панель навігації |

## Жести

| Жест | Handler | Очки |
|---|---|---|
| Одиночний клік | `Gesture.Tap().numberOfTaps(1)` | +1 |
| Подвійний клік | `Gesture.Tap().numberOfTaps(2)` | +2 |
| Довге натискання | `Gesture.LongPress().minDuration(3000)` | +5 |
| Перетягування | `Gesture.Pan()` | 0 |
| Свайп вправо | `Gesture.Fling().direction(1)` | +1–10 |
| Свайп вліво | `Gesture.Fling().direction(2)` | +1–10 |
| Пінч | `Gesture.Pinch()` | +3 |

