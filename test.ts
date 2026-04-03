// PyoBot 테스트 - 교안 기반

// 시작하면: 초기화
PyoBot.init()

// A버튼: 전진 테스트
input.onButtonPressed(Button.A, function () {
    PyoBot.motorRun(PyoMotor.Both, PyoDirection.Forward, 500)
    basic.pause(2000)
    PyoBot.motorStop(PyoMotor.Both)
})

// B버튼: 초음파 거리 측정
input.onButtonPressed(Button.B, function () {
    let dist = PyoBot.ultrasonic()
    basic.showNumber(dist)
})

// A+B버튼: LED + 부저 테스트
input.onButtonPressed(Button.AB, function () {
    PyoBot.pyoLed(PyoLED.Both, PyoLEDState.On)
    PyoBot.buzzer(262, 500)
    basic.pause(1000)
    PyoBot.pyoLed(PyoLED.Both, PyoLEDState.Off)
})

// 라인트레이싱 예제 (교안 Chapter V 참고)
// basic.forever(function () {
//     // 왼쪽 센서가 감지되면 왼쪽 모터 ON, 아니면 OFF
//     if (PyoBot.lineDetected(PyoLineSensor.Left)) {
//         PyoBot.motorRun(PyoMotor.Left, PyoDirection.Forward, 1023)
//     } else {
//         PyoBot.motorStop(PyoMotor.Left)
//     }
//     // 오른쪽 센서가 감지되면 오른쪽 모터 ON, 아니면 OFF
//     if (PyoBot.lineDetected(PyoLineSensor.Right)) {
//         PyoBot.motorRun(PyoMotor.Right, PyoDirection.Forward, 1023)
//     } else {
//         PyoBot.motorStop(PyoMotor.Right)
//     }
// })
