# PyoBot

![PyoBot](icon.png)

PyoBot is a micro:bit robot board extension for Microsoft MakeCode.

## Add to MakeCode

1. Open https://makecode.microbit.org
2. Create or open a project
3. Open **Extensions**
4. Search for `pyobot` or paste:
   `https://github.com/pyocodingcompany-crypto/pyobot-makecode`

## Features

- Motor control for left, right, or both motors
- Line sensor reading and black line detection
- Ultrasonic distance measurement
- Left and right LED control
- Buzzer tone playback
- Servo angle control

## Block Categories

- Motors
- Line Sensor
- Ultrasonic
- LED
- Buzzer
- Servo

## Pin Map

| Function | Pin |
| --- | --- |
| LED Left | P3 |
| LED Right | P4 |
| Buzzer | P0 |
| Line Sensor Left | P6 |
| Line Sensor Right | P7 |
| Ultrasonic Trig | P1 |
| Ultrasonic Echo | P10 |
| Motor Left PWM | P8 |
| Motor Left Dir | P9, P13 |
| Motor Right PWM | P16 |
| Motor Right Dir | P14, P15 |
| Servo | P2 |
| I2C SCL | P19 |
| I2C SDA | P20 |

## HuskyLens

PyoBot can be used together with HuskyLens over I2C on `P19` and `P20`.

- HuskyLens extension: `https://github.com/DFRobot/pxt-DFRobot_HuskyLens`
- It can be used alongside the PyoBot extension because the pin usage does not conflict

## License

MIT

#### Metadata

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
