import cv2

capture = cv2.VideoCapture(0)

cv2.namedWindow("Capture")

while True:
    ret, frame = capture.read();

    cv2.imshow("Capture", frame)

    c = cv2.waitKey(2)
    if c == 27:
        break

capture.release()
cv2.destroyAllWindows()