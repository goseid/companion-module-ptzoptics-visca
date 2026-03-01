# Supplemental Visca Commands

These are VISCA commands found elsewhere that are likely to work with the PTZ Optics cameras. More specific protocol files should be used when available but these may fill in some gaps in documentation.

## Camera Control Commands

| Command       | Function | Packet                     | Comments                                                                                                                                  |
| ------------- | -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Shutter       | Reset    | 81 01 04 0A 00 FF          | Reset Shutter Setting to the default value depending on the frame rate of Output Mode (\* Available during Shutter Priority/Manaual Mode) |
| Shutter       | Up       | 81 01 04 0A 02 FF          | Shutter Setting (\* Available during Shutter Priority/Manaual Mode)                                                                       |
| Shutter       | Down     | 81 01 04 0A 03 FF          | Shutter Setting (\* Available during Shutter Priority/Manaual Mode)                                                                       |
| Iris          | Reset    | 81 01 04 0B 00 FF          | Available during Iris Priority/Manaual Mode                                                                                               |
| Iris          | Up       | 81 01 04 0B 02 FF          | Iris Up (\* Available during Iris Priority/Manual Mode)                                                                                   |
| Iris          | Down     | 81 01 04 0B 03 FF          | Iris Down (\* Available during Iris Priority/Manual Mode)                                                                                 |
| Manual Gain   | Reset    | 81 01 04 0C 00 FF          | Available during AE Manaual Mode                                                                                                          |
| Manual Gain   | Up       | 81 01 04 0C 02 FF          | Gain Setting (\* Available during AE Manaual Mode)                                                                                        |
| Manual Gain   | Down     | 81 01 04 0C 03 FF          | Gain Setting (\* Available during AE Manaual Mode)                                                                                        |
| Exposure Comp | Reset    | 81 01 04 0E 00 FF          | Available during ExpComp On                                                                                                               |
| Exposure Comp | Up       | 81 01 04 0E 02 FF          | Exposure Compensation Up (\* Available during ExpComp On )                                                                                |
| Exposure Comp | Down     | 81 01 04 0E 03 FF          | Exposure Compensation Down (\* Available during ExpComp On )                                                                              |
| Spot Light    | Position | 81 01 04 29 0p 0q 0r 0s    | FF pq: X-axis, 00 ~ 06 rs: Y-axis, 00 ~ 04                                                                                                |
| Gain Limit    |          | 81 01 04 2C 0p FF          | p: 4 ~ F                                                                                                                                  |
| WDR           |          | 81 01 04 2D 0p FF          | p: WDR mode, 0 ~ 3                                                                                                                        |
| Back Light    |          | 81 01 04 33 0p FF          | Back Light Compensation ON/OFF p: 2=On, 3=Off (\* Available during Full Auto Mode)                                                        |
| Mode          |          | 81 01 04 39 pp FF          | pp: 00=Full Auto, 03=Manual, 0A=Shutter Priority, 0B=Iris Priority, 5F=White Board                                                        |
| Exposure Comp | On/Off   | 81 01 04 3E 0p FF          | p: 2=On, 3=Off (\* Disabled during Manual Mode)                                                                                           |
| Shutter       | Direct   | 81 01 04 4A 00 00 0p 0q FF | pq: Shutter Position, 00 ~ 10 (\* Available during Shutter Priority/Manaual Mode)                                                         |
| Iris          | Direct   | 81 01 04 4B 00 00 0p 0q FF | pq: Iris Position, 00 ~ 0D (\* Available during Iris Priority/Manaual Mode)                                                               |
| Manual Gain   | Direct   | 81 01 04 4C 00 00 0p 0q FF | pq: Gain Position, 00 ~ 0F                                                                                                                |
| Exposure Comp | Direct   | 81 01 04 4E 00 00 0p 0q FF | pq: 00 ~ 0A                                                                                                                               |
| Spot Light    |          | 81 01 04 59 0p FF          | p: 2=On, 3=Off                                                                                                                            |
| Sharpness     | Reset    | 8x 01 04 02 00 FF          |                                                                                                                                           |
| Sharpness     | Up       | 8x 01 04 02 02 FF          | Sharpness Up                                                                                                                              |
| Sharpness     | Down     | 8x 01 04 02 03 FF          | Sharpness Down                                                                                                                            |
| Brightness    | Reset    | 8x 01 04 0D 00 FF          |                                                                                                                                           |
| Brightness    | Up       | 8x 01 04 0D 02 FF          | Brightness Up                                                                                                                             |
| Brightness    | Down     | 8x 01 04 0D 03 FF          | Brightness Down                                                                                                                           |
| Image         | Mode     | 8x 01 04 3F 04 0p FF       | p: 0=Default, 1=Custom                                                                                                                    |
| Sharpness     | Direct   | 8x 01 04 42 00 00 0p 0q FF | pq: 00 ~ 0E                                                                                                                               |
| Saturation    |          | 8x 01 04 49 00 00 0p 0q FF | pq: 00 ~ 0F (\* Available during Image Mode = Custom mode)                                                                                |
