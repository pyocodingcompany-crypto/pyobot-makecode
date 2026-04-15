/**
 * PyoBot - micro:bit Robot Board Extension (표쌤코딩)
 *
 * Pin Map:
 *   LED Left: P3,  LED Right: P4
 *   Buzzer: P0
 *   Line Sensor Left: P6,  Line Sensor Right: P7
 *   Ultrasonic Trig: P1,  Ultrasonic Echo: P10
 *   Motor Left:  P8(PWMA), P9(역방향/AIN2), P13(정방향/AIN1)
 *   Motor Right: P16(PWMB), P15(역방향/BIN2), P14(정방향/BIN1)
 *   Servo: P2
 *   I2C: P19(SCL), P20(SDA)
 *
 *   전진: 왼쪽바퀴 반시계(P9=1,P13=0), 오른쪽바퀴 시계(P14=1,P15=0)
 *   후진: 왼쪽바퀴 시계(P9=0,P13=1), 오른쪽바퀴 반시계(P14=0,P15=1)
 */

enum PyoMotor {
    //% block="Left"
    Left = 0,
    //% block="Right"
    Right = 1,
    //% block="Both"
    Both = 2
}

enum PyoDirection {
    //% block="Forward"
    Forward = 0,
    //% block="Backward"
    Backward = 1
}

enum PyoLED {
    //% block="Left"
    Left = 0,
    //% block="Right"
    Right = 1,
    //% block="Both"
    Both = 2
}

enum PyoLEDState {
    //% block="On"
    On = 1,
    //% block="Off"
    Off = 0
}

enum PyoLineSensor {
    //% block="Left"
    Left = 0,
    //% block="Right"
    Right = 1
}

enum PyoTurn {
    //% block="Turn Left"
    Left = 0,
    //% block="Turn Right"
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

    // ───────── 모터 ─────────

    /**
     * Run motor in specified direction and speed.
     * @param motor select motor
     * @param direction direction
     * @param speed speed (0~1023), eg: 500
     */
    //% block="$motor motor $direction speed $speed"
    //% speed.min=0 speed.max=1023 speed.defl=500
    //% group="Motors" weight=99
    export function motorRun(motor: PyoMotor, direction: PyoDirection, speed: number): void {
        motorInit()
        if (motor == PyoMotor.Left || motor == PyoMotor.Both) {
            if (direction == PyoDirection.Forward) {
                // 왼쪽바퀴 반시계방향 = 전진
                pins.digitalWritePin(DigitalPin.P9, 1)
                pins.digitalWritePin(DigitalPin.P13, 0)
            } else {
                // 왼쪽바퀴 시계방향 = 후진
                pins.digitalWritePin(DigitalPin.P9, 0)
                pins.digitalWritePin(DigitalPin.P13, 1)
            }
            pins.analogWritePin(AnalogPin.P8, speed)
        }
        if (motor == PyoMotor.Right || motor == PyoMotor.Both) {
            if (direction == PyoDirection.Forward) {
                // 오른쪽바퀴 시계방향 = 전진
                pins.digitalWritePin(DigitalPin.P14, 1)
                pins.digitalWritePin(DigitalPin.P15, 0)
            } else {
                // 오른쪽바퀴 반시계방향 = 후진
                pins.digitalWritePin(DigitalPin.P14, 0)
                pins.digitalWritePin(DigitalPin.P15, 1)
            }
            pins.analogWritePin(AnalogPin.P16, speed)
        }
    }

    /**
     * Stop motor.
     * @param motor select motor
     */
    //% block="$motor motor stop"
    //% group="Motors" weight=98
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
     * Turn left or right. (stop one side, drive the other)
     * @param turn turn direction
     * @param speed speed (0~1023), eg: 500
     */
    //% block="$turn speed $speed"
    //% speed.min=0 speed.max=1023 speed.defl=500
    //% group="Motors" weight=97
    export function motorTurn(turn: PyoTurn, speed: number): void {
        motorInit()
        if (turn == PyoTurn.Left) {
            // 좌회전: 왼쪽 멈춤, 오른쪽 전진
            motorStop(PyoMotor.Left)
            motorRun(PyoMotor.Right, PyoDirection.Forward, speed)
        } else {
            // 우회전: 왼쪽 전진, 오른쪽 멈춤
            motorRun(PyoMotor.Left, PyoDirection.Forward, speed)
            motorStop(PyoMotor.Right)
        }
    }

    // ───────── 라인센서 ─────────

    /**
     * Read line sensor value. (0: white, 1: black)
     * @param sensor select sensor
     */
    //% block="$sensor line sensor value"
    //% group="Line Sensor" weight=89
    export function lineSensor(sensor: PyoLineSensor): number {
        if (sensor == PyoLineSensor.Left) {
            return pins.digitalReadPin(DigitalPin.P6)
        } else {
            return pins.digitalReadPin(DigitalPin.P7)
        }
    }

    /**
     * Returns true if line sensor detects black line.
     * @param sensor select sensor
     */
    //% block="$sensor line detected"
    //% group="Line Sensor" weight=88
    export function lineDetected(sensor: PyoLineSensor): boolean {
        return lineSensor(sensor) == 1
    }

    /**
     * Returns true if line sensor does not detect black line.
     * @param sensor select sensor
     */
    //% block="$sensor line not detected"
    //% group="Line Sensor" weight=87
    export function lineNotDetected(sensor: PyoLineSensor): boolean {
        return lineSensor(sensor) == 0
    }

    // ───────── 초음파 ─────────

    /**
     * Measure distance with ultrasonic sensor. (cm)
     */
    //% block="ultrasonic distance cm"
    //% group="Ultrasonic" weight=79
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
     * Turn LED on or off.
     * @param led select LED
     * @param state state
     */
    //% block="$led LED $state"
    //% group="LED" weight=69
    export function pyoLed(led: PyoLED, state: PyoLEDState): void {
        if (led == PyoLED.Left || led == PyoLED.Both) {
            pins.digitalWritePin(DigitalPin.P3, state)
        }
        if (led == PyoLED.Right || led == PyoLED.Both) {
            pins.digitalWritePin(DigitalPin.P4, state)
        }
    }

    // ───────── 부저 ─────────

    /**
     * Play tone on buzzer.
     * @param frequency frequency (Hz), eg: 262
     * @param duration duration (ms), eg: 500
     */
    //% block="buzzer frequency $frequency Hz $duration ms"
    //% frequency.min=0 frequency.max=5000 frequency.defl=262
    //% duration.min=0 duration.max=5000 duration.defl=500
    //% group="Buzzer" weight=59
    export function buzzer(frequency: number, duration: number): void {
        pins.analogSetPitchPin(AnalogPin.P0)
        music.playTone(frequency, duration)
    }

    /**
     * Stop buzzer.
     */
    //% block="buzzer off"
    //% group="Buzzer" weight=58
    export function buzzerOff(): void {
        music.stopAllSounds()
    }

    // ───────── 서보 ─────────

    /**
     * Set servo angle.
     * @param angle angle (0~180), eg: 90
     */
    //% block="servo angle $angle °"
    //% angle.min=0 angle.max=180 angle.defl=90
    //% group="Servo" weight=49
    export function servo(angle: number): void {
        pins.servoWritePin(AnalogPin.P2, angle)
    }

    /**
     * Release servo motor.
     */
    //% block="servo release"
    //% group="Servo" weight=48
    export function servoRelease(): void {
        pins.analogWritePin(AnalogPin.P2, 0)
    }
}
