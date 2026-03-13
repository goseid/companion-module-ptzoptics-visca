# PTZOptics 20x 3G-SDI (GEN 2) Protocol Info

This document contains information about the VISCA Protocol for the following cameras:

- PT20X-SDI-GY-G2
- PT20X-SDI-WH-G2 V1.5

## VISCA Command List

### Part 1: Camera-Issued Messages

| Function   | Packet   | Notes            | Comments                                     |
| ---------- | -------- | ---------------- | -------------------------------------------- |
| ACK        | 90 4y FF | y: Socket Number | Returned when the command is accepted.       |
| Completion | 90 5y FF | y: Socket Number | Returned when the command has been executed. |

### Part 2: Camera Control Commands

| Command               | Function           | Packet                               | Comments                                                                                                                |
| --------------------- | ------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| CAM_Zoom              | Stop               | 81 01 04 07 00 FF                    |                                                                                                                         |
| CAM_Zoom              | Tele (Standard)    | 81 01 04 07 02 FF                    |                                                                                                                         |
| CAM_Zoom              | Wide (Standard)    | 81 01 04 07 03 FF                    |                                                                                                                         |
| CAM_Zoom              | Tele (Variable)    | 81 01 04 07 2p FF                    | p = (low) – 7 (high)                                                                                                    |
| CAM_Zoom              | Wide (Variable)    | 81 01 04 07 3p FF                    | p = (low) – 7 (high)                                                                                                    |
| CAM_Zoom              | Direct             | 81 01 04 47 p q r s FF               | pqrs: Zoom Position                                                                                                     |
| CAM_Focus             | Stop               | 81 01 04 08 00 FF                    |                                                                                                                         |
| CAM_Focus             | Far (Standard)     | 81 01 04 08 02 FF                    |                                                                                                                         |
| CAM_Focus             | Near (Standard)    | 81 01 04 08 03 FF                    |                                                                                                                         |
| CAM_Focus             | Far (Variable)     | 81 01 04 08 2p FF                    | p = (low) – 7 (high)                                                                                                    |
| CAM_Focus             | Near (Variable)    | 81 01 04 08 3p FF                    | p = (low) – 7 (high)                                                                                                    |
| CAM_Focus             | Direct             | 81 01 04 48 p q r s FF               | pqrs: Focus Position                                                                                                    |
| CAM_Focus             | Auto Focus         | 81 01 04 38 02 FF                    |                                                                                                                         |
| CAM_Focus             | Manual Focus       | 81 01 04 38 03 FF                    |                                                                                                                         |
| CAM_Focus             | Auto/Manual Toggle | 81 01 04 38 10 FF                    |                                                                                                                         |
| CAM_Focus             | Focus Lock         | 81 0a 04 68 02 FF                    | Prevents any other operation or command from adjusting the current focus state                                          |
| CAM_Focus             | Focus Unlock       | 81 0a 04 68 03 FF                    | Prevents any other operation or command from adjusting the current focus state                                          |
| CAM_WB                | Auto               | 81 01 04 35 00 FF                    | Normal Auto                                                                                                             |
| CAM_WB                | Indoor Mode        | 81 01 04 35 01 FF                    | Indoor Mode                                                                                                             |
| CAM_WB                | Outdoor Mode       | 81 01 04 35 02 FF                    | Outdoor Mode                                                                                                            |
| CAM_WB                | OnePush Mode       | 81 01 04 35 03 FF                    | OnePush WB Mode                                                                                                         |
| CAM_WB                | Manual             | 81 01 04 35 05 FF                    | Manual Control Mode                                                                                                     |
| CAM_WB                | OnePush Trigger    | 81 01 04 10 05 FF                    | OnePush WB Trigger                                                                                                      |
| CAM_RGain             | Reset              | 81 01 04 03 00 FF                    | Manual Control of R Gain                                                                                                |
| CAM_RGain             | Up                 | 81 01 04 03 02 FF                    | Manual Control of R Gain                                                                                                |
| CAM_RGain             | Down               | 81 01 04 03 03 FF                    | Manual Control of R Gain                                                                                                |
| CAM_RGain             | Direct             | 81 01 04 43 00 00 p q FF             | pq: R Gain                                                                                                              |
| CAM_BGain             | Reset              | 81 01 04 04 00 FF                    | Manual Control of B Gain                                                                                                |
| CAM_BGain             | Up                 | 81 01 04 04 02 FF                    | Manual Control of B Gain                                                                                                |
| CAM_BGain             | Down               | 81 01 04 04 03 FF                    | Manual Control of B Gain                                                                                                |
| CAM_BGain             | Direct             | 81 01 04 44 00 00 p q FF             | pq: B Gain                                                                                                              |
| CAM_AE                | Full auto          | 81 01 04 39 00 FF                    | Automatic Exposure mode                                                                                                 |
| CAM_AE                | Manual             | 81 01 04 39 03 FF                    | Manual Control mode                                                                                                     |
| CAM_AE                | Shutter Priority   | 81 01 04 39 0A FF                    | Shutter Priority Automatic Exposure mode                                                                                |
| CAM_AE                | Iris Priority      | 81 01 04 39 0B FF                    | Iris Priority Automatic Exposure mode                                                                                   |
| CAM_AE                | Bright             | 81 01 04 39 0D FF                    | Bright Mode (Manual control)                                                                                            |
| CAM_Iris              | Reset              | 81 01 04 0B 00 FF                    | Reset Iris                                                                                                              |
| Exposure Compensation | On / Off           | 81 01 04 3E 0p FF                    | p: 0x2=On, 0x3=Off                                                                                                      |
| Exposure Compensation | Reset              | 81 01 04 0E 00 FF                    | Resets to 0x7 (0) value                                                                                                 |
| Exposure Compensation | Up                 | 81 01 04 0E 02 FF                    | ExpComp Setting                                                                                                         |
| Exposure Compensation | Down               | 81 01 04 0E 03 FF                    | ExpComp Setting                                                                                                         |
| Exposure Compensation | Direct             | 81 01 04 4E 00 00 0p 0q FF           | pq: ExpComp Position (0x0=-7 ~ 0x7=0 ~ 0xE=+7)                                                                          |
| CAM_Iris              | Up                 | 81 01 04 0B 02 FF                    | Increase Iris                                                                                                           |
| CAM_Iris              | Down               | 81 01 04 0B 03 FF                    | Decrease Iris                                                                                                           |
| CAM_Iris              | Direct             | 81 01 04 4B 00 00 p q FF             | pq: Iris Position                                                                                                       |
| Gain                  | Reset              | 81 01 04 0C 00 FF                    | Resets to 0x2 (2) value                                                                                                 |
| Gain                  | Up                 | 81 01 04 0C 02 FF                    | Gain Setting                                                                                                            |
| Gain                  | Down               | 81 01 04 0C 03 FF                    | Gain Setting                                                                                                            |
| Gain                  | Direct             | 81 01 04 0C 00 00 0p 0q FF           | pq: Gain Position (0x00=0 ~ 0x07=7)                                                                                     |
| Gain                  | Limit              | 81 01 04 2C 0p FF                    | p: Gain Limit Position (0x0=0 ~ 0xF=15)                                                                                 |
| CAM_Shutter           | Reset              | 81 01 04 0A 00 FF                    | Default Shutter Setting                                                                                                 |
| CAM_Shutter           | Up                 | 81 01 04 0A 02 FF                    | Increase Shutter                                                                                                        |
| CAM_Shutter           | Down               | 81 01 04 0A 03 FF                    | Decrease Shutter                                                                                                        |
| CAM_Shutter           | Direct             | 81 01 04 4A 00 00 p q FF             | pq: Shutter Position                                                                                                    |
| Exp_Bright            | Reset              | 81 01 04 0D 00 FF                    | Resets to 0x7 (7) value                                                                                                 |
| Exp_Bright            | Up                 | 81 01 04 0D 02 FF                    | Exposure Bright Setting Up                                                                                              |
| Exp_Bright            | Down               | 81 01 04 0D 03 FF                    | Exposure Bright Setting Down                                                                                            |
| Exp_Bright            | Direct             | 81 01 04 0D 00 00 0p 0q FF           | pq: Exposure Bright Position (0x00=0 ~ 0x11=17)                                                                         |
| CAM_Backlight         | On                 | 81 01 04 33 02 FF                    | Back Light Compensation Off                                                                                             |
| CAM_Backlight         | Off                | 81 01 04 33 03 FF                    | Back Light Compensation Off                                                                                             |
| CAM_Flicker           | -                  | 81 01 04 23 0p FF                    | p: Flicker Settings – (0: Off, 1: 50Hz, 2: 60Hz)                                                                        |
| CAM_PictureEffect     | Off                | 81 01 04 63 00 FF                    | Picture Effect Setting Off                                                                                              |
| CAM_PictureEffect     | B&W                | 81 01 04 63 04 FF                    | Picture Effect Setting Black & White                                                                                    |
| CAM_Memory            | Reset              | 81 01 04 3F 00 pp FF                 | pp: Memory Number(Hex 0,0 – 3,F)                                                                                        |
| CAM_Memory            | Set                | 81 01 04 3F 01 pp FF                 | pp: Memory Number(Hex 0,0 – 3,F)                                                                                        |
| CAM_Memory            | Recall             | 81 01 04 3F 02 pp FF                 | pp: Memory Number(Hex 0,0 – 3,F)                                                                                        |
| Preset Recall Speed   | Preset Speed       | 81 01 06 01 p FF                     | p: is speed grade,the values are 0x1~0x18                                                                               |
| CAM_LR_Reverse        | On                 | 81 01 04 61 02 FF                    | Image Flip Horizontal On                                                                                                |
| CAM_LR_Reverse        | Off                | 81 01 04 61 03 FF                    | Image Flip Horizontal Off                                                                                               |
| CAM_PictureFlip       | On                 | 81 01 04 66 02 FF                    | Image Flip Vertical On                                                                                                  |
| CAM_PictureFlip       | Off                | 81 01 04 66 03 FF                    | Image Flip Vertical Off                                                                                                 |
| Pan Tilt Drive        | Up                 | 81 01 06 01 VV WW 03 01 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Down               | 81 01 06 01 VV WW 03 02 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Left               | 81 01 06 01 VV WW 01 03 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Right              | 81 01 06 01 VV WW 02 03 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Up Left            | 81 01 06 01 VV WW 01 01 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Up Right           | 81 01 06 01 VV WW 02 01 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Down Left          | 81 01 06 01 VV WW 01 02 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Down right         | 81 01 06 01 VV WW 02 02 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Stop               | 81 01 06 01 VV WW 03 03 FF           | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high)                                        |
| Pan Tilt Drive        | Absolute Position  | 81 01 06 02 VV WW Y Y Y Y Z Z Z Z FF | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high) YYYY: Pan Position WWWW: Tilt Position |
| Pan Tilt Drive        | Relative Position  | 81 01 06 03 VV WW Y Y Y Y Z Z Z Z FF | VV: Pan Speed 0x01 (Low) to 0x18 (high) WW: Tilt Speed 0x01 (Low) to 0x18 (high) YYYY: Pan Position WWWW: Tilt Position |
| Pan Tilt Drive        | Home               | 81 01 06 04 FF                       |                                                                                                                         |
| Pan Tilt Drive        | Reset              | 81 01 06 05 FF                       |                                                                                                                         |
| Image_Brightness      | Direct             | 81 01 04 A1 00 00 0p 0q FF           | pq: Brightness Position                                                                                                 |
| Image_Contrast        | Direct             | 81 01 04 A2 00 00 0p 0q FF           | pq: Contrast Position                                                                                                   |
| Image_Sharpness       | Mode               | 81 01 04 05 0p FF                    | p: 0x2=Auto, 0x3=Manual                                                                                                 |
| Image_Sharpness       | Reset              | 81 01 04 02 00 FF                    | Resets to default position 0x03 (3) value                                                                               |
| Image_Sharpness       | Up                 | 81 01 04 02 02 FF                    | Aperture Control                                                                                                        |
| Image_Sharpness       | Down               | 81 01 04 02 03 FF                    | Aperture Control                                                                                                        |
| Image_Sharpness       | Direct             | 81 01 04 42 00 00 0p 0q FF           | pq: Aperture Gain (0x00=0 ~ 0x0F=15)                                                                                    |
| CAM-Flip              | Off                | 81 01 04 A4 00 FF                    | Single Command For Video Flip - Off                                                                                     |
| CAM-Flip              | Flip-H             | 81 01 04 A4 01 FF                    | Flip Video Horizontally                                                                                                 |
| CAM-Flip              | Flip-V             | 81 01 04 A4 02 FF                    | Flip Video Vertically                                                                                                   |
| CAM-Flip              | Flip-HV            | 81 01 04 A4 03 FF                    | Flip Video Horizontally and Vertically                                                                                  |
| CAM_SettingSave       | Save               | 81 01 04 A5 10 FF                    | Save Current Setting                                                                                                    |
| CAM_AWBSensitivity    | High               | 81 01 04 A9 00 FF                    | High                                                                                                                    |
| CAM_AWBSensitivity    | Normal             | 81 01 04 A9 01 FF                    | Normal                                                                                                                  |
| CAM_AWBSensitivity    | Low                | 81 01 04 A9 02 FF                    | Low                                                                                                                     |
| CAM_AFZone            | Top                | 81 01 04 AA 00 FF                    | AF Zone priority Top                                                                                                    |
| CAM_AFZone            | Center             | 81 01 04 AA 01 FF                    | AF Zone priority Center                                                                                                 |
| CAM_AFZone            | Bottom             | 81 01 04 AA 02 FF                    | AF Zone priority Bottom                                                                                                 |
| CAM_ColorHue          | Direct             | 81 01 04 4F 00 00 00 0p FF           | p: Color Hue 0h (−14 degrees) to Eh (+14 degrees)                                                                       |
| OSD_Control           | Open/Close         | 81 01 06 06 10 FF                    | Open or Close the On Screen Display                                                                                     |

### Part 3: Query Commands

#### Individual Inquiries

| Command                  | Command Packet    | Response Packet                  | Comments                                                                                                                                                     |
| ------------------------ | ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CAM_PowerInq             | 81 090 04 00 FF   | 90 50 0p FF                      | p: 2=On, 3=Off (standby), 4=Interna Power Circuit Error                                                                                                      |
| CAM_ZoomPosInq           | 81 09 04 47 FF    | 90 50 p q r s FF                 | pqrs: Zoom Position                                                                                                                                          |
| CAM_FocusAFModeInq       | 81 09 04 38 FF    | 90 50 0p FF                      | p: 2=Auto Focus, 3=Manual Focus                                                                                                                              |
| CAM_FocusPosInq          | 81 09 04 48 FF    | 90 50 0p 0q 0r 0s FF             | pqrs: Focus Position                                                                                                                                         |
| CAM_WBModeInq            | 81 09 04 35 FF    | 90 50 0p FF                      | p: 0=Auto, 1=Indoor, 2=Outdoor, 3=OnePush, 5=Manual                                                                                                          |
| CAM_RGainInq             | 81 09 04 43 FF    | 90 50 00 00 0p 0q FF             | pq: R Gain                                                                                                                                                   |
| CAM_BGainInq             | 81 09 04 44 FF    | 90 50 00 00 0p 0q FF             | pq: B Gain                                                                                                                                                   |
| CAM_AEModeInq            | 81 09 04 39 FF    | 90 50 0p FF                      | p: 0=Full Auto, 3=Manual, A=Shutter Priority, B=Iris Priority, D=Bright                                                                                      |
| CAM_ShutterPosInq        | 81 09 04 4A FF    | 90 50 00 00 0p 0q FF             | pq: Shutter Position                                                                                                                                         |
| CAM_IrisPosInq           | 81 09 04 4B FF    | 90 50 00 00 0p 0q FF             | pq: Iris Position                                                                                                                                            |
| CAM_BrightPosInq         | 81 09 04 4D FF    | 90 50 00 00 0p 0q FF             | pq: Bright Position                                                                                                                                          |
| CAM_ExpCompModeInq       | 81 09 04 3E FF    | 90 50 0p FF                      | p: 2=On, 3=Off                                                                                                                                               |
| CAM_ExpCompPosInq        | 81 09 04 4E FF    | 90 50 00 00 0p 0q FF             | pq: ExpComp Position                                                                                                                                         |
| CAM_BacklightModeInq     | 81 09 04 33 FF    | 90 50 0p FF                      | p: 2=On, 3=Off                                                                                                                                               |
| CAM_Noise2DModeInq       | 81 09 04 50 FF    | 90 50 0p FF                      | p: 2=Auto Noise 2D, 3=Manual Noise 2D                                                                                                                        |
| CAM_Noise2DLevel         | 81 09 04 53 FF    | 90 50 0p FF                      | Noise Reduction (2D) p: 0 to 5                                                                                                                               |
| CAM_Noise3DLevel         | 81 09 04 54 FF    | 90 50 0p FF                      | Noise Reduction (3D) p: 0 to 8                                                                                                                               |
| CAM_FlickerModeInq       | 81 09 04 55 FF    | 90 50 0p FF                      | p: Flicker Settings(0: OFF, 1: 50Hz, 2: 60Hz)                                                                                                                |
| CAM_SharpnessModeInq     | 81 09 04 05 FF    | 90 50 0p FF                      | p: 2=Auto, 3=Manual                                                                                                                                          |
| CAM_SharpnessInq         | 81 09 04 42 FF    | 90 50 00 00 0p 0q FF             | pq: Sharpness                                                                                                                                                |
| CAM_PictureEffectModeInq | 81 09 04 63 FF    | 90 50 0p FF                      | p: 2=Off, 4=B&W                                                                                                                                              |
| CAM_MemoryInq            | 81 09 04 3F FF    | 90 50 0p FF                      | p: Memory number last operated                                                                                                                               |
| SYS_MenuModeInq          | 81 09 06 06 FF    | 90 50 0p FF                      | p: 2=On, 3= Off                                                                                                                                              |
| CAM_LR_ReverseInq        | 81 09 04 61 FF    | 90 50 0p FF                      | p: 2=On, 3=Off                                                                                                                                               |
| CAM_PictureFlipInq       | 81 09 04 66 FF    | 90 50 0p FF                      | p: 2=On, 3=Off                                                                                                                                               |
| CAM_RegisterValueInq     | 81 09 04 24 mm FF | 90 50 0p 0p FF                   | mm: REgister No. (00 to FF), pp: Register Value (00 to FF)                                                                                                   |
| CAM_ColorGainInq         | 81 09 04 49 FF    | 90 50 00 00 00 0p FF             | p: Color Gain setting 0h (60%) to Eh (200%)                                                                                                                  |
| CAM_IDInq                | 81 09 04 22 FF    | 90 50 0p 0q 0r 0s FF             | pqrs: Camera ID                                                                                                                                              |
| CAM_VersionInq           | 81 09 00 02 FF    | 90 50 ab cd mn pq rs tu vw FF    | ab: Factory Code (00=VHD, 01=MR, 08=T), cd: Hardware Version, mnpq: ARM Version, rstu: FPGA Version, vw: Camera Model (01=C Type, 02=M Type, 03=S Type)      |
| VideoSystemInq           | 81 09 06 23 FF    | 90 50 0p FF                      | p: 0=1920x1080i60, 1=1920x1080p30, 2=1280x720p60, 4=NTSC, 5=NTSC, 6=NTSC, 7=1920x1080p60, 8=1920x1080i50, 9=1920x1080p25, A=1280x720p50, C=PAL, D=PAL, E=PAL |
| IR_Receive               | 81 09 06 08 FF    | 90 50 0p FF                      | p: 2=On, 3=Off                                                                                                                                               |
| Pan-tiltMaxSpeedInq      | 81 09 06 11 FF    | 90 50 ww zz FF                   | ww: Pan Max Speed, zz: Tilt Max Speed                                                                                                                        |
| CAM_PanTiltPosInq        | 81 09 06 12 FF    | 90 50 0w 0w 0w 0w 0z 0z 0z 0z FF | wwww: Pan Position, zzzz: Tilt Position                                                                                                                      |
| CAM_TypeInq              | 81 09 00 03 FF    | 90 50 0p FF                      | p: 1=C Type, 2=M Type, 3=S Type                                                                                                                              |
| CAM_DateInq              | 81 09 00 04 FF    | 90 50 0r ss uu uu vv ww 0D FF    | r: unknown, ss: unknown, uuuu: Year, vv: Month, ww: Day                                                                                                      |
| CAM_ModeInq              | 81 09 04 A6 FF    | 90 50 0p FF                      | p: 0=Mode0, 2=Mode2                                                                                                                                          |
| CAM_GainLimitInq         | 81 09 04 2C FF    | 90 50 0q FF                      | p: Gain Limit                                                                                                                                                |
| CAM_DHotPixelInq         | 81 09 04 56 FF    | 90 50 0q FF                      | p: Dynamic Hot Pixel Setting (0: 0ff, level 1 to 6)                                                                                                          |
| CAM_AFSensitivityInq     | 81 09 04 58 FF    | 90 50 0p FF                      | p: 1=High, 2=Normal, 3=Low                                                                                                                                   |
| CAM_BrightnessInq        | 81 09 04 A1 FF    | 90 50 00 00 0p 0q FF             | pq: Brightness Position                                                                                                                                      |
| CAM_ContrastInq          | 81 09 04 A2 FF    | 90 50 00 00 0p 0q FF             | pq: Contrast Position                                                                                                                                        |
| CAM_FlipInq              | 81 09 04 A4 FF    | 90 50 0p FF                      | p: 0=Off, 1=Flip-H, 2=Flip-V, 3=Flip-HV                                                                                                                      |
| CAM_IridixInq            | 81 09 04 A7 FF    | 90 50 00 00 0p 0q FF             | pq: Iridix Position                                                                                                                                          |
| CAM_AFZone               | 81 09 04 AA FF    | 90 50 0p FF                      | p: 0=Top, 1=Center, 2=Bottom                                                                                                                                 |
| CAM_ColorHueInq          | 81 09 04 4F FF    | 90 50 00 00 00 0p FF             | p: Color Hue setting 0h (−14 dgrees) to Eh (+14 degrees)                                                                                                     |
| CAM_AWBSensitivityInq    | 81 09 04 A9 FF    | 90 50 0p FF                      | p: 0=High, 1=Normal, 2=Low                                                                                                                                   |

#### Block Inquiries

| Command                 | Command Packet    | Response Packet                                 | Comments                                                                                                                                                                                                              |
| ----------------------- | ----------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CAM_LensBlockInq        | 81 09 7E 7E 00 FF | 90 50 0u 0u 0u 0u 00 00 0v 0v 0v 0v 00 0w 00 FF | uuuu: Zoom Position, vvvv: Focus Position, w.bit0: Focus Mode (1=Auto, 0=Manual)                                                                                                                                      |
| CAM_CameraBlockInq      | 81 09 7E 7E 01 FF | 90 50 0p 0p 0q 0q 0r 0s tt 0u vv ww yy xx 0z FF | pp: R_Gain, qq: B_Gain, r: WB Mode, s: Sharpness, tt: AE Mode, u.bit2: Back Light, u.bit1: Exposure Comp, vv: Shutter Position, ww: Iris Position, yy: Gain Position, xx: Bright Position, z: Exposure Comp. Position |
| CAM_OtherBlockInq       | 81 09 7E 7E 02 FF | 90 50 0p 0q 00 0r 00 00 00 00 00 00 00 00 00 FF | p.bit0: Power (1:On, 0:Off), q.bit2: LR Reverse (1:On, 0:Off), r.bit3~0: Picture Effect Mode                                                                                                                          |
| CAM_EnlargementBlockInq | 81 09 7E 7E 03 FF | 90 50 00 00 00 00 00 00 00 0p 0q rr 0s 0t 0u FF | p: AF sensitivity, q.bit0: Picture flip(1:On, 0:Off), rr.bit6~3: Color Gain(0h(60%) to Eh(200%)) s: Flip(0: Off, 1:Flip-H, 2:Flip-V, 3:Flip-HV), t.bit2~0: NR2D Level, u: Gain Limit                                  |
