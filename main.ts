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
    //% block="왼쪽"
    Left = 0,
    //% block="오른쪽"
    Right = 1,
    //% block="양쪽"
    Both = 2
}

enum PyoDirection {
    //% block="전진"
    Forward = 0,
    //% block="후진"
    Backward = 1
}

enum PyoLED {
    //% block="왼쪽"
    Left = 0,
    //% block="오른쪽"
    Right = 1,
    //% block="양쪽"
    Both = 2
}

enum PyoLEDState {
    //% block="켜기"
    On = 1,
    //% block="끄기"
    Off = 0
}

enum PyoLineSensor {
    //% block="왼쪽"
    Left = 0,
    //% block="오른쪽"
    Right = 1
}

enum PyoTurn {
    //% block="좌회전"
    Left = 0,
    //% block="우회전"
    Right = 1
}

//% weight=100 color=#FF6B35 icon="\uf1b9" block="PyoBot"
//% groups="['모터', '라인센서', '초음파', 'LED', '부저', '서보']"
namespace PyoBot {

    /**
     * PyoBot을 초기화합니다. 시작하면 블록 안에 넣어주세요.
     */
    //% block="PyoBot 초기화"
    //% weight=100
    export function init(): void {
        led.enable(false)
    }

    // ───────── 모터 ─────────

    /**
     * 모터를 지정한 방향과 속도로 작동합니다.
     * @param motor 모터 선택
     * @param direction 방향
     * @param speed 속도 (0~1023), eg: 500
     */
    //% block="$motor 모터 $direction 속도 $speed"
    //% speed.min=0 speed.max=1023 speed.defl=500
    //% group="모터" weight=99
    export function motorRun(motor: PyoMotor, direction: PyoDirection, speed: number): void {
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
     * 모터를 정지합니다.
     * @param motor 모터 선택
     */
    //% block="$motor 모터 정지"
    //% group="모터" weight=98
    export function motorStop(motor: PyoMotor): void {
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
     * 좌회전/우회전합니다. (한쪽 멈추고 반대쪽 전진)
     * @param turn 회전 방향
     * @param speed 속도 (0~1023), eg: 500
     */
    //% block="$turn 속도 $speed"
    //% speed.min=0 speed.max=1023 speed.defl=500
    //% group="모터" weight=97
    export function motorTurn(turn: PyoTurn, speed: number): void {
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
     * 라인센서 값을 읽습니다. (0: 흰색, 1: 검정)
     * @param sensor 센서 선택
     */
    //% block="$sensor 라인센서 감지"
    //% group="라인센서" weight=89
    export function lineSensor(sensor: PyoLineSensor): number {
        if (sensor == PyoLineSensor.Left) {
            return pins.digitalReadPin(DigitalPin.P6)
        } else {
            return pins.digitalReadPin(DigitalPin.P7)
        }
    }

    /**
     * 라인센서가 검정 라인을 감지했는지 확인합니다.
     * @param sensor 센서 선택
     */
    //% block="$sensor 라인센서 검정 감지?"
    //% group="라인센서" weight=88
    export function lineDetected(sensor: PyoLineSensor): boolean {
        return lineSensor(sensor) == 1
    }

    // ───────── 초음파 ─────────

    /**
     * 초음파 센서로 거리를 측정합니다. (cm)
     */
    //% block="초음파 거리 (cm)"
    //% group="초음파" weight=79
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
     * LED를 켜거나 끕니다.
     * @param led LED 선택
     * @param state 상태
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
     * 부저로 음을 재생합니다.
     * @param frequency 주파수 (Hz), eg: 262
     * @param duration 재생 시간 (ms), eg: 500
     */
    //% block="부저 주파수 $frequency Hz $duration ms"
    //% frequency.min=0 frequency.max=5000 frequency.defl=262
    //% duration.min=0 duration.max=5000 duration.defl=500
    //% group="부저" weight=59
    export function buzzer(frequency: number, duration: number): void {
        pins.analogSetPitchPin(AnalogPin.P0)
        music.playTone(frequency, duration)
    }

    /**
     * 부저를 끕니다.
     */
    //% block="부저 끄기"
    //% group="부저" weight=58
    export function buzzerOff(): void {
        music.stopAllSounds()
    }

    // ───────── 서보 ─────────

    /**
     * 서보 모터 각도를 설정합니다.
     * @param angle 각도 (0~180), eg: 90
     */
    //% block="서보 각도 $angle °"
    //% angle.min=0 angle.max=180 angle.defl=90
    //% group="서보" weight=49
    export function servo(angle: number): void {
        pins.servoWritePin(AnalogPin.P2, angle)
    }

    /**
     * 서보 모터를 해제합니다.
     */
    //% block="서보 해제"
    //% group="서보" weight=48
    export function servoRelease(): void {
        pins.analogWritePin(AnalogPin.P2, 0)
    }
}
