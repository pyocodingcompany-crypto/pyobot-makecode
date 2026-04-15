/**
 * PyoBot Extension Test Suite
 *
 * Tests all blocks in the PyoBot extension.
 * Hardware required: PyoBot robot car board with micro:bit.
 *
 * How to test:
 *   1. Load this file in MakeCode alongside main.ts
 *   2. Deploy to a micro:bit connected to a PyoBot board
 *   3. Press buttons A, B, A+B to run each test group
 *   4. Observe results on LED matrix and hardware behavior
 *
 * Pass/Fail criteria:
 *   - PASS: LED shows check icon, hardware responds as described
 *   - FAIL: LED shows X icon, or hardware does not respond
 *
 * Note: This extension uses hardware pins (motors, sensors, etc.)
 * that are not available in the simulator. All pin operations are
 * safe in the simulator (they return 0 / do nothing), so no
 * simulator errors will occur.
 */

let testPass = 0
let testFail = 0

function showPass(): void {
    testPass += 1
    basic.showIcon(IconNames.Yes)
    basic.pause(500)
    basic.clearScreen()
}

function showFail(): void {
    testFail += 1
    basic.showIcon(IconNames.No)
    basic.pause(500)
    basic.clearScreen()
}

// ===== Test Group A: Motors =====
// Press button A to run motor tests.
// Expected: both motors run forward 1s, backward 1s, turn left 1s,
// turn right 1s, then stop. LED matrix is disabled during motor use.
input.onButtonPressed(Button.A, function () {
    basic.showString("M")
    basic.pause(300)

    // Test motorRun forward
    PyoBot.motorRun(PyoMotor.Both, PyoDirection.Forward, 500)
    basic.pause(1000)

    // Test motorRun backward
    PyoBot.motorRun(PyoMotor.Both, PyoDirection.Backward, 500)
    basic.pause(1000)

    // Test motorRun single motor
    PyoBot.motorRun(PyoMotor.Left, PyoDirection.Forward, 500)
    basic.pause(500)
    PyoBot.motorRun(PyoMotor.Right, PyoDirection.Forward, 500)
    basic.pause(500)

    // Test motorTurn left
    PyoBot.motorTurn(PyoTurn.Left, 500)
    basic.pause(1000)

    // Test motorTurn right
    PyoBot.motorTurn(PyoTurn.Right, 500)
    basic.pause(1000)

    // Test motorStop
    PyoBot.motorStop(PyoMotor.Both)

    showPass()
})

// ===== Test Group B: Sensors =====
// Press button B to run sensor tests.
// Expected: displays ultrasonic distance (cm) on LED matrix,
// then shows line sensor values (L and R) as 0 or 1.
input.onButtonPressed(Button.B, function () {
    basic.showString("S")
    basic.pause(300)

    // Test ultrasonic - should return a number >= 0
    let dist = PyoBot.ultrasonic()
    if (dist >= 0) {
        basic.showNumber(dist)
        basic.pause(1000)
        showPass()
    } else {
        showFail()
    }

    // Test lineSensor - should return 0 or 1
    let leftVal = PyoBot.lineSensor(PyoLineSensor.Left)
    let rightVal = PyoBot.lineSensor(PyoLineSensor.Right)
    if ((leftVal == 0 || leftVal == 1) && (rightVal == 0 || rightVal == 1)) {
        basic.showString("L" + leftVal + "R" + rightVal)
        basic.pause(1000)
        showPass()
    } else {
        showFail()
    }

    // Test lineDetected / lineNotDetected - boolean checks
    let detected = PyoBot.lineDetected(PyoLineSensor.Left)
    let notDetected = PyoBot.lineNotDetected(PyoLineSensor.Left)
    if (detected != notDetected) {
        showPass()
    } else {
        showFail()
    }
})

// ===== Test Group A+B: LED, Buzzer, Servo =====
// Press A+B to run LED, buzzer, and servo tests.
// Expected: LEDs blink, buzzer plays tone, servo moves to 0/90/180.
input.onButtonPressed(Button.AB, function () {
    basic.showString("O")
    basic.pause(300)

    // Test LED on/off
    PyoBot.pyoLed(PyoLED.Both, PyoLEDState.On)
    basic.pause(500)
    PyoBot.pyoLed(PyoLED.Both, PyoLEDState.Off)
    basic.pause(200)
    PyoBot.pyoLed(PyoLED.Left, PyoLEDState.On)
    basic.pause(300)
    PyoBot.pyoLed(PyoLED.Left, PyoLEDState.Off)
    PyoBot.pyoLed(PyoLED.Right, PyoLEDState.On)
    basic.pause(300)
    PyoBot.pyoLed(PyoLED.Right, PyoLEDState.Off)
    showPass()

    // Test buzzer
    PyoBot.buzzer(262, 300)
    basic.pause(400)
    PyoBot.buzzer(523, 300)
    basic.pause(400)
    PyoBot.buzzerOff()
    showPass()

    // Test servo
    PyoBot.servo(0)
    basic.pause(500)
    PyoBot.servo(90)
    basic.pause(500)
    PyoBot.servo(180)
    basic.pause(500)
    PyoBot.servoRelease()
    showPass()

    // Show total results
    basic.pause(500)
    basic.showString("P" + testPass + "F" + testFail)
})
