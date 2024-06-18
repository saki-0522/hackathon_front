import cv2

def main():
    # (1) 指定された番号のカメラに対するキャプチャオブジェクトを作成する
    capture = cv2.VideoCapture(0)
    
    # (2) 表示用ウィンドウの初期化
    cv2.namedWindow("Capture", cv2.WINDOW_AUTOSIZE)

    # cascade_name = "/usr/share/opencv4/haarcascades/haarcascade_frontalface_default.xml"
    cascade_name = "/usr/share/opencv4/haarcascades/haarcascade_smile.xml"

    cascade = cv2.CascadeClassifier(cascade_name)
    colors = [
        (0, 0, 255), (0, 128, 255), (0, 255, 255), (0, 255, 0),
        (255, 128, 0), (255, 255, 0), (255, 0, 0), (255, 0, 255)
    ]

    while capture.isOpened():
        # (3) カメラから画像をキャプチャする
        ret, frame = capture.read()
        if not ret:
            break

        # (3) 読み込んだ画像のグレースケール化，ヒストグラムの均一化を行う
        src_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        cv2.equalizeHist(src_gray, src_gray)

        # (4) 物体（顔）検出.結果はfacesに格納する．
        faces = cascade.detectMultiScale(src_gray, 1.1, 2, 0 | cv2.CASCADE_SCALE_IMAGE, (40, 40))

        # (5) 検出された全ての顔位置に，円を描画する
        for i, (x, y, w, h) in enumerate(faces):
            center = (x + w // 2, y + h // 2)
            radius = (w + h) // 4
            cv2.circle(frame, center, radius, colors[i % len(colors)], 3, 8, 0)

        # (4) カメラ画像の表示
        cv2.imshow("Capture", frame)

        # (5) 2msecだけキー入力を待つ
        c = cv2.waitKey(2)
        if c == 27:  # Escキー
            break

    cv2.destroyWindow("Capture")
    capture.release()

if __name__ == "__main__":
    main()
