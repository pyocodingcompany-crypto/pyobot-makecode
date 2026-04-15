# PyoBot

![PyoBot](icon.png)

PyoBot is a micro:bit robot car board extension for Microsoft MakeCode.
Control motors, line sensors, ultrasonic sensor, LEDs, buzzer, and servo with simple blocks.

## Add to MakeCode

1. Open [https://makecode.microbit.org](https://makecode.microbit.org)
2. Create or open a project
3. Click **Extensions**
4. Paste this URL:
   `https://github.com/pyocodingcompany-crypto/pyobot-makecode`

## Product Page

- [PyoBot Product Page (표쌤코딩)](https://pyocodingcompany-crypto.github.io/pyobot-makecode/)

## Tutorials and Resources

- [PyoBot Getting Started Guide](https://pyocodingcompany-crypto.github.io/pyobot-makecode/#getting-started)
- [Line Tracing Example](https://pyocodingcompany-crypto.github.io/pyobot-makecode/#example-line-tracing)
- [Obstacle Avoidance Example](https://pyocodingcompany-crypto.github.io/pyobot-makecode/#example-obstacle-avoidance)
- [micro:bit MakeCode Reference](https://makecode.microbit.org/reference)
- [MakeCode Blocks Editor Guide](https://makecode.microbit.org/blocks)

## API Reference

### ~hint
#### Hardware Required
This extension requires a PyoBot robot car board connected to a BBC micro:bit.
Motor blocks will automatically disable the micro:bit LED matrix due to shared pin usage.
### ~

### Motors

Run motors forward or backward at a given speed (0–1023).

```blocks
// Run both motors forward at speed 500
PyoBot.motorRun(PyoMotor.Both, PyoDirection.Forward, 500)

// Run left motor backward at speed 300
PyoBot.motorRun(PyoMotor.Left, PyoDirection.Backward, 300)

// Stop all motors
PyoBot.motorStop(PyoMotor.Both)
```

Turn by stopping one side and driving the other.

```blocks
// Turn left at speed 500
PyoBot.motorTurn(PyoTurn.Left, 500)

// Turn right at speed 500
PyoBot.motorTurn(PyoTurn.Right, 500)
```

### Line Sensor

Read line sensor values. Returns 0 for white surface, 1 for black line.

```blocks
// Read raw value
let val = PyoBot.lineSensor(PyoLineSensor.Left)

// Boolean: is black line detected?
if (PyoBot.lineDetected(PyoLineSensor.Left)) {
    PyoBot.motorRun(PyoMotor.Left, PyoDirection.Forward, 1023)
}

// Boolean: is black line NOT detected?
if (PyoBot.lineNotDetected(PyoLineSensor.Right)) {
    PyoBot.motorStop(PyoMotor.Right)
}
```

**Line tracing example:**

```blocks
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
```

### Ultrasonic

Measure distance in centimeters using the ultrasonic sensor (P1 trig, P10 echo).

```blocks
// Show distance on LED matrix
let dist = PyoBot.ultrasonic()
basic.showNumber(dist)
```

**Obstacle avoidance example:**

```blocks
basic.forever(function () {
    if (PyoBot.ultrasonic() < 15) {
        PyoBot.motorStop(PyoMotor.Both)
        PyoBot.motorTurn(PyoTurn.Right, 500)
        basic.pause(500)
    } else {
        PyoBot.motorRun(PyoMotor.Both, PyoDirection.Forward, 500)
    }
})
```

### LED

Control left (P3) and right (P4) LEDs on the board.

```blocks
// Turn on both LEDs
PyoBot.pyoLed(PyoLED.Both, PyoLEDState.On)

// Turn off left LED
PyoBot.pyoLed(PyoLED.Left, PyoLEDState.Off)
```

### Buzzer

Play tones on the buzzer (P0). Frequency in Hz, duration in ms.

```blocks
// Play middle C for 500ms
PyoBot.buzzer(262, 500)

// Stop buzzer
PyoBot.buzzerOff()
```

### Servo

Control a servo motor on P2. Angle range: 0–180 degrees.

```blocks
// Set servo to 90 degrees
PyoBot.servo(90)

// Release servo (stop PWM signal)
PyoBot.servoRelease()
```

## Pin Map

| Function | Pin |
| --- | --- |
| LED Left / Right | P3 / P4 |
| Buzzer | P0 |
| Line Sensor Left / Right | P6 / P7 |
| Ultrasonic Trig / Echo | P1 / P10 |
| Motor Left (PWM, Dir) | P8, P9, P13 |
| Motor Right (PWM, Dir) | P16, P14, P15 |
| Servo | P2 |
| I2C (SCL / SDA) | P19 / P20 |

> **Note:** Motor use disables the micro:bit LED matrix because P3, P4, P6, P7, P9, P10 are shared with the LED display. Use an I2C OLED display if you need both motors and a screen.

## Use with HuskyLens

PyoBot works alongside [HuskyLens](https://github.com/DFRobot/pxt-DFRobot_HuskyLens) over I2C (`P19`/`P20`). No pin conflict.

## Testing

See `test.ts` for a complete test suite. Press buttons A, B, or A+B on the micro:bit to run different test groups.

## License

MIT

## Supported targets

* for PXT/microbit

#### Metadata

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}")</script>
