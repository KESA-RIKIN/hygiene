from ultralytics import YOLO
import cv2

model = YOLO(r"runs/detect/runs/detect/ppe_yolov82/weights/best.pt")

img = cv2.imread("test.jpg")
results = model(img)
annotated = results[0].plot()

cv2.imshow("PPE Test", annotated)
cv2.waitKey(0)
cv2.destroyAllWindows()