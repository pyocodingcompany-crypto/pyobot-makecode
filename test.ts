// PyoBot Test

// A button: forward test
input.onButtonPressed(Button.A, function () {
    PyoBot.motorRun(PyoMotor.Both, PyoDirection.Forward, 500)
    basic.pause(2000)
    PyoBot.motorStop(PyoMotor.Both)
})

// B button: ultrasonic distance
input.onButtonPressed(Button.B, function () {
    let dist = PyoBot.ultrasonic()
    basic.showNumber(dist)
})

// A+B button: LED + buzzer test
input.onButtonPressed(Button.AB, function () {
    PyoBot.pyoLed(PyoLED.Both, PyoLEDState.On)
    PyoBot.buzzer(262, 500)
    basic.pause(1000)
    PyoBot.pyoLed(PyoLED.Both, PyoLEDState.Off)
})

// Line tracing
basic.forever(function () {
    if (PyoBot.lineDetected(PyoLineSensor.Left)) {
        PyoBot.motorRun(PyoMotor.Left, PyoDirection.Forward, 1023)
    } else {
        PyoBot.motorStop(PyoMotor.Left)
    }
    if (PyoBot.lineDetected(PyoLineSensor.Right)) {
        PyoBot.motorRun(PyoMotor.Right, PyoDirection.Forward, 1023)
    } else {
        PyoBot.motorStop(PyoMotor.Right)
    }
})

// Servo test
PyoBot.servo(90)
basic.pause(1000)
PyoBot.servoRelease()

// Turn test
PyoBot.motorTurn(PyoTurn.Left, 500)
basic.pause(1000)
PyoBot.motorTurn(PyoTurn.Right, 500)
basic.pause(1000)
PyoBot.motorStop(PyoMotor.Both)

// Line sensor value
let val = PyoBot.lineSensor(PyoLineSensor.Left)
let notDetected = PyoBot.lineNotDetected(PyoLineSensor.Right)

// Buzzer off
PyoBot.buzzerOff()
