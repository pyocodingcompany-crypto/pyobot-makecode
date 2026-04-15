/**
 * PyoBot - micro:bit Robot Board Extension (표쌤코딩)
 *
 * Pin Map:
 *   LED Left: P3,  LED Right: P4
 *   Buzzer: P0
 *   Line Sensor Left: P6,  Line Sensor Right: P7
 *   Ultrasonic Trig: P1,  Ultrasonic Echo: P10
 *   Motor Left:  P8(PWMA), P9(AIN2), P13(AIN1)
 *   Motor Right: P16(PWMB), P15(BIN2), P14(BIN1)
 *   Servo: P2
 *   I2C: P19(SCL), P20(SDA)
 */

enum PyoMotor {
    //% block="left"
    Left = 0,
    //% block="right"
    Right = 1,
    //% block="both"
    Both = 2
}

enum PyoDirection {
    //% block="forward"
    Forward = 0,
    //% block="backward"
    Backward = 1
}

enum PyoLED {
    //% block="left"
    Left = 0,
    //% block="right"
    Right = 1,
    //% block="both"
    Both = 2
}

enum PyoLEDState {
    //% block="on"
    On = 1,
    //% block="off"
    Off = 0
}

enum PyoLineSensor {
    //% block="left"
    Left = 0,
    //% block="right"
    Right = 1
}

enum PyoTurn {
    //% block="turn left"
    Left = 0,
    //% block="turn right"
    Right = 1
}

//% weight=100 color=#FF6B35 icon="\uf1b9" block="PyoBot"
//% groups="['Motors', 'Line Sensor', 'Ultrasonic', 'LED', 'Buzzer', 'Servo']"
namespace PyoBot {

    let _motorInit = false
    function motorInit(): void {
        if (!_motorInit) {
            _motorInit = true
            led.enable(false)
        }
    }

    // ───────── Motors ─────────

    /**
     * Run motor in specified direction and speed.
     * Automatically disables the LED matrix (pin conflict).
     * @param motor select motor, eg: PyoMotor.Both
     * @param direction direction, eg: PyoDirection.Forward
     * @param speed speed (0~1023), eg: 500
     */
    //% block="$motor motor $direction speed $speed"
    //% speed.min=0 speed.max=1023 speed.defl=500
    //% group="Motors" weight=99
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function motorRun(motor: PyoMotor, direction: PyoDirection, speed: number): void {
        motorInit()
        if (motor == PyoMotor.Left || motor == PyoMotor.Both) {
            if (direction == PyoDirection.Forward) {
                pins.digitalWritePin(DigitalPin.P9, 1)
                pins.digitalWritePin(DigitalPin.P13, 0)
            } else {
                pins.digitalWritePin(DigitalPin.P9, 0)
                pins.digitalWritePin(DigitalPin.P13, 1)
            }
            pins.analogWritePin(AnalogPin.P8, speed)
        }
        if (motor == PyoMotor.Right || motor == PyoMotor.Both) {
            if (direction == PyoDirection.Forward) {
                pins.digitalWritePin(DigitalPin.P14, 1)
                pins.digitalWritePin(DigitalPin.P15, 0)
            } else {
                pins.digitalWritePin(DigitalPin.P14, 0)
                pins.digitalWritePin(DigitalPin.P15, 1)
            }
            pins.analogWritePin(AnalogPin.P16, speed)
        }
    }

    /**
     * Stop motor. Sets PWM to 0 and clears direction pins.
     * @param motor select motor, eg: PyoMotor.Both
     */
    //% block="$motor motor stop"
    //% group="Motors" weight=98
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function motorStop(motor: PyoMotor): void {
        motorInit()
        if (motor == PyoMotor.Left || motor == PyoMotor.Both) {
            pins.analogWritePin(AnalogPin.P8, 0)
            pins.digitalWritePin(DigitalPin.P9, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
        }
        if (motor == PyoMotor.Right || motor == PyoMotor.Both) {
            pins.analogWritePin(AnalogPin.P16, 0)
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 0)
        }
    }

    /**
     * Turn left or right by stopping one side and driving the other.
     * @param turn turn direction, eg: PyoTurn.Left
     * @param speed speed (0~1023), eg: 500
     */
    //% block="$turn speed $speed"
    //% speed.min=0 speed.max=1023 speed.defl=500
    //% group="Motors" weight=97
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function motorTurn(turn: PyoTurn, speed: number): void {
        motorInit()
        if (turn == PyoTurn.Left) {
            motorStop(PyoMotor.Left)
            motorRun(PyoMotor.Right, PyoDirection.Forward, speed)
        } else {
            motorRun(PyoMotor.Left, PyoDirection.Forward, speed)
            motorStop(PyoMotor.Right)
        }
    }

    // ───────── Line Sensor ─────────

    /**
     * Read line sensor value. Returns 0 for white surface, 1 for black line.
     * @param sensor select sensor, eg: PyoLineSensor.Left
     */
    //% block="$sensor line sensor value"
    //% group="Line Sensor" weight=89
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function lineSensor(sensor: PyoLineSensor): number {
        if (sensor == PyoLineSensor.Left) {
            return pins.digitalReadPin(DigitalPin.P6)
        } else {
            return pins.digitalReadPin(DigitalPin.P7)
        }
    }

    /**
     * Returns true if line sensor detects a black line.
     * @param sensor select sensor, eg: PyoLineSensor.Left
     */
    //% block="$sensor line detected"
    //% group="Line Sensor" weight=88
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function lineDetected(sensor: PyoLineSensor): boolean {
        return lineSensor(sensor) == 1
    }

    /**
     * Returns true if line sensor does not detect a black line.
     * @param sensor select sensor, eg: PyoLineSensor.Right
     */
    //% block="$sensor line not detected"
    //% group="Line Sensor" weight=87
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function lineNotDetected(sensor: PyoLineSensor): boolean {
        return lineSensor(sensor) == 0
    }

    // ───────── Ultrasonic ─────────

    /**
     * Measure distance with ultrasonic sensor in centimeters.
     * Uses P1 (trig) and P10 (echo).
     */
    //% block="ultrasonic distance cm"
    //% group="Ultrasonic" weight=79
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function ultrasonic(): number {
        pins.digitalWritePin(DigitalPin.P1, 0)
        control.waitMicros(2)
        pins.digitalWritePin(DigitalPin.P1, 1)
        control.waitMicros(10)
        pins.digitalWritePin(DigitalPin.P1, 0)

        const duration = pins.pulseIn(DigitalPin.P10, PulseValue.High, 30000)
        return Math.round(duration / 58)
    }

    // ───────── LED ─────────

    /**
     * Turn LED on or off. Uses P3 (left) and P4 (right).
     * @param pyoLed select LED, eg: PyoLED.Both
     * @param state on or off, eg: PyoLEDState.On
     */
    //% block="$pyoLed LED $state"
    //% group="LED" weight=69
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function pyoLed(pyoLed: PyoLED, state: PyoLEDState): void {
        if (pyoLed == PyoLED.Left || pyoLed == PyoLED.Both) {
            pins.digitalWritePin(DigitalPin.P3, state)
        }
        if (pyoLed == PyoLED.Right || pyoLed == PyoLED.Both) {
            pins.digitalWritePin(DigitalPin.P4, state)
        }
    }

    // ───────── Buzzer ─────────

    /**
     * Play a tone on the buzzer at the given frequency and duration.
     * Uses P0 as the pitch pin.
     * @param frequency frequency in Hz, eg: 262
     * @param duration duration in ms, eg: 500
     */
    //% block="buzzer frequency $frequency Hz $duration ms"
    //% frequency.min=0 frequency.max=5000 frequency.defl=262
    //% duration.min=0 duration.max=5000 duration.defl=500
    //% group="Buzzer" weight=59
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function buzzer(frequency: number, duration: number): void {
        pins.analogSetPitchPin(AnalogPin.P0)
        music.playTone(frequency, duration)
    }

    /**
     * Stop all buzzer sounds.
     */
    //% block="buzzer off"
    //% group="Buzzer" weight=58
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function buzzerOff(): void {
        music.stopAllSounds()
    }

    // ───────── Servo ─────────

    /**
     * Set servo motor angle on P2.
     * @param angle angle in degrees (0~180), eg: 90
     */
    //% block="servo angle $angle °"
    //% angle.min=0 angle.max=180 angle.defl=90
    //% group="Servo" weight=49
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function servo(angle: number): void {
        pins.servoWritePin(AnalogPin.P2, angle)
    }

    /**
     * Release servo motor (stop sending PWM signal).
     */
    //% block="servo release"
    //% group="Servo" weight=48
    //% help=github:pyocodingcompany-crypto/pyobot-makecode/README
    export function servoRelease(): void {
        pins.analogWritePin(AnalogPin.P2, 0)
    }
}
