import cv2
import time

# ビデオキャプチャの設定
capture = cv2.VideoCapture(0)
capture.set(3, 640)  # 幅
capture.set(4, 360)  # 高さ

# カスケードファイルの読み込み
face_cascade = cv2.CascadeClassifier('./src/haarcascade_frontalface_default.xml')
smile_cascade = cv2.CascadeClassifier('./src/haarcascade_smile.xml')

# 開始時間の記録
start_time = time.time()

# 笑顔が検出されている開始時間
smile_start_time = None

while True:
    ret, img = capture.read()
    img = cv2.flip(img, 1)  # 鏡表示にする
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.1, 5)
    smile_detected = False
    for (x, y, w, h) in faces:
        cv2.circle(img, (int(x + w / 2), int(y + h / 2)), int(w / 2), (255, 0, 0), 2)  # 青色の円

        roi_gray = gray[y:y + h, x:x + w]  # 顔領域を切り出し
        smiles = smile_cascade.detectMultiScale(roi_gray, scaleFactor=1.2, minNeighbors=10, minSize=(20, 20))  # 笑顔識別
        if len(smiles) > 0:
            smile_detected = True
            for (sx, sy, sw, sh) in smiles:
                cv2.circle(img, (int(x + sx + sw / 2), int(y + sy + sh / 2)), int(sw / 2), (0, 0, 255), 2)  # 赤色の円

    if smile_detected:
        if smile_start_time is None:
            smile_start_time = time.time()
        elif time.time() - smile_start_time >= 2:
            print("smile detected")
            break
    else:
        smile_start_time = None

    cv2.imshow('img', img)

    # 経過時間のチェック
    if time.time() - start_time > 10:
        print("time end")
        break

    # キー操作
    key = cv2.waitKey(5)
    if key == 27:  # escキーで終了
        break

capture.release()
cv2.destroyAllWindows()
print("Exit")