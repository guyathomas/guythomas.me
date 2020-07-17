import { DarkMode } from "./DarkMode"

export type ColorSpectrumType =
  | "lyftPink"
  | "alwaysWhite"
  | "alwaysBlack"
  | "red0"
  | "red5"
  | "red10"
  | "red20"
  | "red30"
  | "red40"
  | "red50"
  | "red60"
  | "red70"
  | "red80"
  | "red90"
  | "red100"
  | "sunset0"
  | "sunset5"
  | "sunset10"
  | "sunset20"
  | "sunset30"
  | "sunset40"
  | "sunset50"
  | "sunset60"
  | "sunset70"
  | "sunset80"
  | "sunset90"
  | "sunset100"
  | "orange0"
  | "orange5"
  | "orange10"
  | "orange20"
  | "orange30"
  | "orange40"
  | "orange50"
  | "orange60"
  | "orange70"
  | "orange80"
  | "orange90"
  | "orange100"
  | "amber0"
  | "amber5"
  | "amber10"
  | "amber20"
  | "amber30"
  | "amber40"
  | "amber50"
  | "amber60"
  | "amber70"
  | "amber80"
  | "amber90"
  | "amber100"
  | "yellow0"
  | "yellow5"
  | "yellow10"
  | "yellow20"
  | "yellow30"
  | "yellow40"
  | "yellow50"
  | "yellow60"
  | "yellow70"
  | "yellow80"
  | "yellow90"
  | "yellow100"
  | "citron0"
  | "citron5"
  | "citron10"
  | "citron20"
  | "citron30"
  | "citron40"
  | "citron50"
  | "citron60"
  | "citron70"
  | "citron80"
  | "citron90"
  | "citron100"
  | "lime0"
  | "lime5"
  | "lime10"
  | "lime20"
  | "lime30"
  | "lime40"
  | "lime50"
  | "lime60"
  | "lime70"
  | "lime80"
  | "lime90"
  | "lime100"
  | "green0"
  | "green5"
  | "green10"
  | "green20"
  | "green30"
  | "green40"
  | "green50"
  | "green60"
  | "green70"
  | "green80"
  | "green90"
  | "green100"
  | "mint0"
  | "mint5"
  | "mint10"
  | "mint20"
  | "mint30"
  | "mint40"
  | "mint50"
  | "mint60"
  | "mint70"
  | "mint80"
  | "mint90"
  | "mint100"
  | "teal0"
  | "teal5"
  | "teal10"
  | "teal20"
  | "teal30"
  | "teal40"
  | "teal50"
  | "teal60"
  | "teal70"
  | "teal80"
  | "teal90"
  | "teal100"
  | "cyan0"
  | "cyan5"
  | "cyan10"
  | "cyan20"
  | "cyan30"
  | "cyan40"
  | "cyan50"
  | "cyan60"
  | "cyan70"
  | "cyan80"
  | "cyan90"
  | "cyan100"
  | "blue0"
  | "blue5"
  | "blue10"
  | "blue20"
  | "blue30"
  | "blue40"
  | "blue50"
  | "blue60"
  | "blue70"
  | "blue80"
  | "blue90"
  | "blue100"
  | "indigo0"
  | "indigo5"
  | "indigo10"
  | "indigo20"
  | "indigo30"
  | "indigo40"
  | "indigo50"
  | "indigo60"
  | "indigo70"
  | "indigo80"
  | "indigo90"
  | "indigo100"
  | "purple0"
  | "purple5"
  | "purple10"
  | "purple20"
  | "purple30"
  | "purple40"
  | "purple50"
  | "purple60"
  | "purple70"
  | "purple80"
  | "purple90"
  | "purple100"
  | "pink0"
  | "pink5"
  | "pink10"
  | "pink20"
  | "pink30"
  | "pink40"
  | "pink50"
  | "pink60"
  | "pink70"
  | "pink80"
  | "pink90"
  | "pink100"
  | "rose0"
  | "rose5"
  | "rose10"
  | "rose20"
  | "rose30"
  | "rose40"
  | "rose50"
  | "rose60"
  | "rose70"
  | "rose80"
  | "rose90"
  | "rose100"
  | "gray0"
  | "gray5"
  | "gray10"
  | "gray15"
  | "gray20"
  | "gray30"
  | "gray40"
  | "gray50"
  | "gray60"
  | "gray70"
  | "gray80"
  | "gray90"
  | "gray100"

type ColorType = {
  color: string
  value: number
}

export const COLOR_SPECTRUM: { [key in ColorSpectrumType]: ColorType } = {
  lyftPink: {
    get color() {
      return DarkMode.enabled ? "#FF00BF" : "#FF00BF"
    },
    value: 50,
  },
  alwaysWhite: {
    get color() {
      return DarkMode.enabled ? "#FFFFFF" : "#FFFFFF"
    },
    value: 0,
  },
  alwaysBlack: {
    get color() {
      return DarkMode.enabled ? "#000000" : "#000000"
    },
    value: 100,
  },
  red0: {
    get color() {
      return DarkMode.enabled ? "#571020" : "#FFFAFB"
    },
    value: 0,
  },
  red5: {
    get color() {
      return DarkMode.enabled ? "#6B1427" : "#FFE5E9"
    },
    value: 5,
  },
  red10: {
    get color() {
      return DarkMode.enabled ? "#7F182E" : "#FFCFD5"
    },
    value: 10,
  },
  red20: {
    get color() {
      return DarkMode.enabled ? "#A4233B" : "#FFA0AC"
    },
    value: 20,
  },
  red30: {
    get color() {
      return DarkMode.enabled ? "#C2324A" : "#FF7689"
    },
    value: 30,
  },
  red40: {
    get color() {
      return DarkMode.enabled ? "#D8465B" : "#FF516B"
    },
    value: 40,
  },
  red50: {
    get color() {
      return DarkMode.enabled ? "#E75E70" : "#FF3354"
    },
    value: 50,
  },
  red60: {
    get color() {
      return DarkMode.enabled ? "#F07A88" : "#E6193F"
    },
    value: 60,
  },
  red70: {
    get color() {
      return DarkMode.enabled ? "#F699A3" : "#B8072C"
    },
    value: 70,
  },
  red80: {
    get color() {
      return DarkMode.enabled ? "#FABAC0" : "#8C0020"
    },
    value: 80,
  },
  red90: {
    get color() {
      return DarkMode.enabled ? "#FDD9DD" : "#670019"
    },
    value: 90,
  },
  red100: {
    get color() {
      return DarkMode.enabled ? "#FFF5F6" : "#560015"
    },
    value: 100,
  },
  sunset0: {
    get color() {
      return DarkMode.enabled ? "#4A1108" : "#FFFBFA"
    },
    value: 0,
  },
  sunset5: {
    get color() {
      return DarkMode.enabled ? "#60170B" : "#FFE4DD"
    },
    value: 5,
  },
  sunset10: {
    get color() {
      return DarkMode.enabled ? "#761D0E" : "#FFCCBF"
    },
    value: 10,
  },
  sunset20: {
    get color() {
      return DarkMode.enabled ? "#9D2C17" : "#FF9E87"
    },
    value: 20,
  },
  sunset30: {
    get color() {
      return DarkMode.enabled ? "#BD3E26" : "#FF7B5C"
    },
    value: 30,
  },
  sunset40: {
    get color() {
      return DarkMode.enabled ? "#D55339" : "#FF623E"
    },
    value: 40,
  },
  sunset50: {
    get color() {
      return DarkMode.enabled ? "#E56C52" : "#FF4E28"
    },
    value: 50,
  },
  sunset60: {
    get color() {
      return DarkMode.enabled ? "#EF8771" : "#DB3615"
    },
    value: 60,
  },
  sunset70: {
    get color() {
      return DarkMode.enabled ? "#F6A492" : "#AF230A"
    },
    value: 70,
  },
  sunset80: {
    get color() {
      return DarkMode.enabled ? "#FAC3B6" : "#841604"
    },
    value: 80,
  },
  sunset90: {
    get color() {
      return DarkMode.enabled ? "#FDE0D9" : "#5F0E01"
    },
    value: 90,
  },
  sunset100: {
    get color() {
      return DarkMode.enabled ? "#FFF9F7" : "#4E0B00"
    },
    value: 100,
  },
  orange0: {
    get color() {
      return DarkMode.enabled ? "#4D1300" : "#FFF6F2"
    },
    value: 0,
  },
  orange5: {
    get color() {
      return DarkMode.enabled ? "#621900" : "#FFE8DD"
    },
    value: 5,
  },
  orange10: {
    get color() {
      return DarkMode.enabled ? "#781F01" : "#FFD9C7"
    },
    value: 10,
  },
  orange20: {
    get color() {
      return DarkMode.enabled ? "#9E2D07" : "#FFB38F"
    },
    value: 20,
  },
  orange30: {
    get color() {
      return DarkMode.enabled ? "#BE3E13" : "#FF915D"
    },
    value: 30,
  },
  orange40: {
    get color() {
      return DarkMode.enabled ? "#D55225" : "#FF7232"
    },
    value: 40,
  },
  orange50: {
    get color() {
      return DarkMode.enabled ? "#E56A3F" : "#F9560E"
    },
    value: 50,
  },
  orange60: {
    get color() {
      return DarkMode.enabled ? "#EF855F" : "#D03D00"
    },
    value: 60,
  },
  orange70: {
    get color() {
      return DarkMode.enabled ? "#F6A284" : "#A82E00"
    },
    value: 70,
  },
  orange80: {
    get color() {
      return DarkMode.enabled ? "#FAC1AB" : "#832300"
    },
    value: 80,
  },
  orange90: {
    get color() {
      return DarkMode.enabled ? "#FDDFD1" : "#651A00"
    },
    value: 90,
  },
  orange100: {
    get color() {
      return DarkMode.enabled ? "#FFF7F2" : "#581600"
    },
    value: 100,
  },
  amber0: {
    get color() {
      return DarkMode.enabled ? "#CC5B0A" : "#FFFDFA"
    },
    value: 0,
  },
  amber5: {
    get color() {
      return DarkMode.enabled ? "#CF610C" : "#FFF6E7"
    },
    value: 5,
  },
  amber10: {
    get color() {
      return DarkMode.enabled ? "#D3670E" : "#FFF0D4"
    },
    value: 10,
  },
  amber20: {
    get color() {
      return DarkMode.enabled ? "#DA7515" : "#FFE0A9"
    },
    value: 20,
  },
  amber30: {
    get color() {
      return DarkMode.enabled ? "#E2831F" : "#FFD082"
    },
    value: 30,
  },
  amber40: {
    get color() {
      return DarkMode.enabled ? "#EA932D" : "#FFC161"
    },
    value: 40,
  },
  amber50: {
    get color() {
      return DarkMode.enabled ? "#F0A341" : "#FFB146"
    },
    value: 50,
  },
  amber60: {
    get color() {
      return DarkMode.enabled ? "#F6B45C" : "#FFA030"
    },
    value: 60,
  },
  amber70: {
    get color() {
      return DarkMode.enabled ? "#FAC67D" : "#FF8D1F"
    },
    value: 70,
  },
  amber80: {
    get color() {
      return DarkMode.enabled ? "#FDD8A2" : "#FE7E13"
    },
    value: 80,
  },
  amber90: {
    get color() {
      return DarkMode.enabled ? "#FEE8C8" : "#E66909"
    },
    value: 90,
  },
  amber100: {
    get color() {
      return DarkMode.enabled ? "#FFF7EB" : "#CB5803"
    },
    value: 100,
  },
  yellow0: {
    get color() {
      return DarkMode.enabled ? "#B07500" : "#FFFEFA"
    },
    value: 0,
  },
  yellow5: {
    get color() {
      return DarkMode.enabled ? "#B57B01" : "#FFF8D9"
    },
    value: 5,
  },
  yellow10: {
    get color() {
      return DarkMode.enabled ? "#BA8203" : "#FFF3B8"
    },
    value: 10,
  },
  yellow20: {
    get color() {
      return DarkMode.enabled ? "#C6920A" : "#FFE77B"
    },
    value: 20,
  },
  yellow30: {
    get color() {
      return DarkMode.enabled ? "#D2A213" : "#FFDD4C"
    },
    value: 30,
  },
  yellow40: {
    get color() {
      return DarkMode.enabled ? "#DEB222" : "#FFD32A"
    },
    value: 40,
  },
  yellow50: {
    get color() {
      return DarkMode.enabled ? "#E8C136" : "#FFCA13"
    },
    value: 50,
  },
  yellow60: {
    get color() {
      return DarkMode.enabled ? "#F0D052" : "#FFC002"
    },
    value: 60,
  },
  yellow70: {
    get color() {
      return DarkMode.enabled ? "#F7DD74" : "#EFAC00"
    },
    value: 70,
  },
  yellow80: {
    get color() {
      return DarkMode.enabled ? "#FBE99C" : "#DC9900"
    },
    value: 80,
  },
  yellow90: {
    get color() {
      return DarkMode.enabled ? "#FEF3C4" : "#C78700"
    },
    value: 90,
  },
  yellow100: {
    get color() {
      return DarkMode.enabled ? "#FFFBE8" : "#B07600"
    },
    value: 100,
  },
  citron0: {
    get color() {
      return DarkMode.enabled ? "#5B8011" : "#FFFFF2"
    },
    value: 0,
  },
  citron5: {
    get color() {
      return DarkMode.enabled ? "#63871A" : "#FFFFD2"
    },
    value: 5,
  },
  citron10: {
    get color() {
      return DarkMode.enabled ? "#6D9024" : "#FEFFB2"
    },
    value: 10,
  },
  citron20: {
    get color() {
      return DarkMode.enabled ? "#83A33D" : "#FBFF6F"
    },
    value: 20,
  },
  citron30: {
    get color() {
      return DarkMode.enabled ? "#9BB75A" : "#F1FB3B"
    },
    value: 30,
  },
  citron40: {
    get color() {
      return DarkMode.enabled ? "#B4CA7B" : "#E2F316"
    },
    value: 40,
  },
  citron50: {
    get color() {
      return DarkMode.enabled ? "#CADA9B" : "#CCE700"
    },
    value: 50,
  },
  citron60: {
    get color() {
      return DarkMode.enabled ? "#DDE7B8" : "#B5D900"
    },
    value: 60,
  },
  citron70: {
    get color() {
      return DarkMode.enabled ? "#ECF2CE" : "#9AC800"
    },
    value: 70,
  },
  citron80: {
    get color() {
      return DarkMode.enabled ? "#F6F9DE" : "#82B400"
    },
    value: 80,
  },
  citron90: {
    get color() {
      return DarkMode.enabled ? "#FCFEE8" : "#6C9C00"
    },
    value: 90,
  },
  citron100: {
    get color() {
      return DarkMode.enabled ? "#FFFFEB" : "#578000"
    },
    value: 100,
  },
  lime0: {
    get color() {
      return DarkMode.enabled ? "#0F3607" : "#FDFFFA"
    },
    value: 0,
  },
  lime5: {
    get color() {
      return DarkMode.enabled ? "#144009" : "#EDFED0"
    },
    value: 5,
  },
  lime10: {
    get color() {
      return DarkMode.enabled ? "#1A4A0B" : "#D6F3A0"
    },
    value: 10,
  },
  lime20: {
    get color() {
      return DarkMode.enabled ? "#285E0E" : "#A4DC48"
    },
    value: 20,
  },
  lime30: {
    get color() {
      return DarkMode.enabled ? "#387212" : "#75C404"
    },
    value: 30,
  },
  lime40: {
    get color() {
      return DarkMode.enabled ? "#498617" : "#5EAB00"
    },
    value: 40,
  },
  lime50: {
    get color() {
      return DarkMode.enabled ? "#5C9A1D" : "#499300"
    },
    value: 50,
  },
  lime60: {
    get color() {
      return DarkMode.enabled ? "#70AE27" : "#347D00"
    },
    value: 60,
  },
  lime70: {
    get color() {
      return DarkMode.enabled ? "#86C339" : "#216800"
    },
    value: 70,
  },
  lime80: {
    get color() {
      return DarkMode.enabled ? "#A6D761" : "#155600"
    },
    value: 80,
  },
  lime90: {
    get color() {
      return DarkMode.enabled ? "#CFEBA6" : "#0E4400"
    },
    value: 90,
  },
  lime100: {
    get color() {
      return DarkMode.enabled ? "#F7FFEB" : "#0A3600"
    },
    value: 100,
  },
  green0: {
    get color() {
      return DarkMode.enabled ? "#1A361A" : "#FAFFFC"
    },
    value: 0,
  },
  green5: {
    get color() {
      return DarkMode.enabled ? "#1F4020" : "#D1FFE2"
    },
    value: 5,
  },
  green10: {
    get color() {
      return DarkMode.enabled ? "#244A27" : "#A8FFC4"
    },
    value: 10,
  },
  green20: {
    get color() {
      return DarkMode.enabled ? "#2E5E34" : "#4BE77A"
    },
    value: 20,
  },
  green30: {
    get color() {
      return DarkMode.enabled ? "#387243" : "#04CD3D"
    },
    value: 30,
  },
  green40: {
    get color() {
      return DarkMode.enabled ? "#438653" : "#00B32E"
    },
    value: 40,
  },
  green50: {
    get color() {
      return DarkMode.enabled ? "#4F9A63" : "#009B22"
    },
    value: 50,
  },
  green60: {
    get color() {
      return DarkMode.enabled ? "#5DAE75" : "#008316"
    },
    value: 60,
  },
  green70: {
    get color() {
      return DarkMode.enabled ? "#70C38A" : "#006E0B"
    },
    value: 70,
  },
  green80: {
    get color() {
      return DarkMode.enabled ? "#90D7A8" : "#005A05"
    },
    value: 80,
  },
  green90: {
    get color() {
      return DarkMode.enabled ? "#C2EBD0" : "#004802"
    },
    value: 90,
  },
  green100: {
    get color() {
      return DarkMode.enabled ? "#F5FFF8" : "#003901"
    },
    value: 100,
  },
  mint0: {
    get color() {
      return DarkMode.enabled ? "#153625" : "#FAFFFD"
    },
    value: 0,
  },
  mint5: {
    get color() {
      return DarkMode.enabled ? "#1A402D" : "#D1FFEE"
    },
    value: 5,
  },
  mint10: {
    get color() {
      return DarkMode.enabled ? "#1E4A35" : "#A6FBDE"
    },
    value: 10,
  },
  mint20: {
    get color() {
      return DarkMode.enabled ? "#265E45" : "#4AE3AE"
    },
    value: 20,
  },
  mint30: {
    get color() {
      return DarkMode.enabled ? "#2F7256" : "#04CA83"
    },
    value: 30,
  },
  mint40: {
    get color() {
      return DarkMode.enabled ? "#388667" : "#00B16F"
    },
    value: 40,
  },
  mint50: {
    get color() {
      return DarkMode.enabled ? "#439A79" : "#00985D"
    },
    value: 50,
  },
  mint60: {
    get color() {
      return DarkMode.enabled ? "#50AE8B" : "#00824C"
    },
    value: 60,
  },
  mint70: {
    get color() {
      return DarkMode.enabled ? "#63C3A0" : "#006C3C"
    },
    value: 70,
  },
  mint80: {
    get color() {
      return DarkMode.enabled ? "#86D7BA" : "#00592F"
    },
    value: 80,
  },
  mint90: {
    get color() {
      return DarkMode.enabled ? "#BDEBDB" : "#004724"
    },
    value: 90,
  },
  mint100: {
    get color() {
      return DarkMode.enabled ? "#F5FFFB" : "#00381C"
    },
    value: 100,
  },
  teal0: {
    get color() {
      return DarkMode.enabled ? "#163634" : "#FAFFFE"
    },
    value: 0,
  },
  teal5: {
    get color() {
      return DarkMode.enabled ? "#1B403E" : "#D1FFF7"
    },
    value: 5,
  },
  teal10: {
    get color() {
      return DarkMode.enabled ? "#1F4A48" : "#A8FFF4"
    },
    value: 10,
  },
  teal20: {
    get color() {
      return DarkMode.enabled ? "#285E5D" : "#4CEAE4"
    },
    value: 20,
  },
  teal30: {
    get color() {
      return DarkMode.enabled ? "#317272" : "#04CED2"
    },
    value: 30,
  },
  teal40: {
    get color() {
      return DarkMode.enabled ? "#3B8586" : "#00B0B9"
    },
    value: 40,
  },
  teal50: {
    get color() {
      return DarkMode.enabled ? "#46989A" : "#00949F"
    },
    value: 50,
  },
  teal60: {
    get color() {
      return DarkMode.enabled ? "#53ABAE" : "#007B85"
    },
    value: 60,
  },
  teal70: {
    get color() {
      return DarkMode.enabled ? "#66BFC3" : "#00626B"
    },
    value: 70,
  },
  teal80: {
    get color() {
      return DarkMode.enabled ? "#89D3D7" : "#004C53"
    },
    value: 80,
  },
  teal90: {
    get color() {
      return DarkMode.enabled ? "#BEE9EB" : "#003B40"
    },
    value: 90,
  },
  teal100: {
    get color() {
      return DarkMode.enabled ? "#F5FEFF" : "#003338"
    },
    value: 100,
  },
  cyan0: {
    get color() {
      return DarkMode.enabled ? "#042A4F" : "#FAFDFF"
    },
    value: 0,
  },
  cyan5: {
    get color() {
      return DarkMode.enabled ? "#05325C" : "#E7F6FF"
    },
    value: 5,
  },
  cyan10: {
    get color() {
      return DarkMode.enabled ? "#073C6A" : "#D4F0FF"
    },
    value: 10,
  },
  cyan20: {
    get color() {
      return DarkMode.enabled ? "#0D5187" : "#A9E1FF"
    },
    value: 20,
  },
  cyan30: {
    get color() {
      return DarkMode.enabled ? "#1769A4" : "#82D2FF"
    },
    value: 30,
  },
  cyan40: {
    get color() {
      return DarkMode.enabled ? "#2681BD" : "#5DBCF4"
    },
    value: 40,
  },
  cyan50: {
    get color() {
      return DarkMode.enabled ? "#3B98D2" : "#3A97D3"
    },
    value: 50,
  },
  cyan60: {
    get color() {
      return DarkMode.enabled ? "#57AEE2" : "#2277B3"
    },
    value: 60,
  },
  cyan70: {
    get color() {
      return DarkMode.enabled ? "#7BC4ED" : "#135B96"
    },
    value: 70,
  },
  cyan80: {
    get color() {
      return DarkMode.enabled ? "#A3D8F6" : "#09457B"
    },
    value: 80,
  },
  cyan90: {
    get color() {
      return DarkMode.enabled ? "#CCEBFB" : "#043563"
    },
    value: 90,
  },
  cyan100: {
    get color() {
      return DarkMode.enabled ? "#F2FBFF" : "#01284E"
    },
    value: 100,
  },
  blue0: {
    get color() {
      return DarkMode.enabled ? "#102B61" : "#FAFBFF"
    },
    value: 0,
  },
  blue5: {
    get color() {
      return DarkMode.enabled ? "#15377D" : "#E8ECFF"
    },
    value: 5,
  },
  blue10: {
    get color() {
      return DarkMode.enabled ? "#1B4498" : "#D5DCFF"
    },
    value: 10,
  },
  blue20: {
    get color() {
      return DarkMode.enabled ? "#285BC6" : "#ACBBFF"
    },
    value: 20,
  },
  blue30: {
    get color() {
      return DarkMode.enabled ? "#3870E8" : "#869DFF"
    },
    value: 30,
  },
  blue40: {
    get color() {
      return DarkMode.enabled ? "#4B81FE" : "#6686FF"
    },
    value: 40,
  },
  blue50: {
    get color() {
      return DarkMode.enabled ? "#5E8CFF" : "#4B73FF"
    },
    value: 50,
  },
  blue60: {
    get color() {
      return DarkMode.enabled ? "#769AFF" : "#3668FF"
    },
    value: 60,
  },
  blue70: {
    get color() {
      return DarkMode.enabled ? "#94ADFF" : "#2156DB"
    },
    value: 70,
  },
  blue80: {
    get color() {
      return DarkMode.enabled ? "#B5C5FF" : "#1242AF"
    },
    value: 80,
  },
  blue90: {
    get color() {
      return DarkMode.enabled ? "#D7DEFF" : "#093186"
    },
    value: 90,
  },
  blue100: {
    get color() {
      return DarkMode.enabled ? "#F7F8FF" : "#042260"
    },
    value: 100,
  },
  indigo0: {
    get color() {
      return DarkMode.enabled ? "#2C2166" : "#FAFAFF"
    },
    value: 0,
  },
  indigo5: {
    get color() {
      return DarkMode.enabled ? "#382A81" : "#EBEBFF"
    },
    value: 5,
  },
  indigo10: {
    get color() {
      return DarkMode.enabled ? "#45349B" : "#DCDCFF"
    },
    value: 10,
  },
  indigo20: {
    get color() {
      return DarkMode.enabled ? "#5B47C8" : "#BABAFF"
    },
    value: 20,
  },
  indigo30: {
    get color() {
      return DarkMode.enabled ? "#6F5AE9" : "#9C9BFF"
    },
    value: 30,
  },
  indigo40: {
    get color() {
      return DarkMode.enabled ? "#816DFE" : "#8481FF"
    },
    value: 40,
  },
  indigo50: {
    get color() {
      return DarkMode.enabled ? "#8D7DFF" : "#726BFF"
    },
    value: 50,
  },
  indigo60: {
    get color() {
      return DarkMode.enabled ? "#9C90FF" : "#665AFF"
    },
    value: 60,
  },
  indigo70: {
    get color() {
      return DarkMode.enabled ? "#B0A9FF" : "#604CFF"
    },
    value: 70,
  },
  indigo80: {
    get color() {
      return DarkMode.enabled ? "#C7C4FF" : "#523BE4"
    },
    value: 80,
  },
  indigo90: {
    get color() {
      return DarkMode.enabled ? "#E1E0FF" : "#3E29B1"
    },
    value: 90,
  },
  indigo100: {
    get color() {
      return DarkMode.enabled ? "#FAFAFF" : "#2B1B81"
    },
    value: 100,
  },
  purple0: {
    get color() {
      return DarkMode.enabled ? "#4A1E87" : "#FDFAFF"
    },
    value: 0,
  },
  purple5: {
    get color() {
      return DarkMode.enabled ? "#522197" : "#F6EBFF"
    },
    value: 5,
  },
  purple10: {
    get color() {
      return DarkMode.enabled ? "#5C26A8" : "#ECDCFF"
    },
    value: 10,
  },
  purple20: {
    get color() {
      return DarkMode.enabled ? "#7535CF" : "#D7B8FF"
    },
    value: 20,
  },
  purple30: {
    get color() {
      return DarkMode.enabled ? "#8945E8" : "#C294FF"
    },
    value: 30,
  },
  purple40: {
    get color() {
      return DarkMode.enabled ? "#9857F2" : "#AD71FF"
    },
    value: 40,
  },
  purple50: {
    get color() {
      return DarkMode.enabled ? "#A76DF8" : "#9B52FF"
    },
    value: 50,
  },
  purple60: {
    get color() {
      return DarkMode.enabled ? "#B787FB" : "#8B37FF"
    },
    value: 60,
  },
  purple70: {
    get color() {
      return DarkMode.enabled ? "#CBA4FC" : "#7B20F9"
    },
    value: 70,
  },
  purple80: {
    get color() {
      return DarkMode.enabled ? "#DFC3FE" : "#590DC4"
    },
    value: 80,
  },
  purple90: {
    get color() {
      return DarkMode.enabled ? "#F1E0FE" : "#420499"
    },
    value: 90,
  },
  purple100: {
    get color() {
      return DarkMode.enabled ? "#FDFAFF" : "#390188"
    },
    value: 100,
  },
  pink0: {
    get color() {
      return DarkMode.enabled ? "#4A0D4A" : "#FFFAFD"
    },
    value: 0,
  },
  pink5: {
    get color() {
      return DarkMode.enabled ? "#60125D" : "#FFE1F2"
    },
    value: 5,
  },
  pink10: {
    get color() {
      return DarkMode.enabled ? "#76176F" : "#FFC7E4"
    },
    value: 10,
  },
  pink20: {
    get color() {
      return DarkMode.enabled ? "#9D238C" : "#FF8FCC"
    },
    value: 20,
  },
  pink30: {
    get color() {
      return DarkMode.enabled ? "#BD31A1" : "#FF5DBB"
    },
    value: 30,
  },
  pink40: {
    get color() {
      return DarkMode.enabled ? "#D542AF" : "#FF32B1"
    },
    value: 40,
  },
  pink50: {
    get color() {
      return DarkMode.enabled ? "#E557BB" : "#FF0EB0"
    },
    value: 50,
  },
  pink60: {
    get color() {
      return DarkMode.enabled ? "#EF71C6" : "#DE00A7"
    },
    value: 60,
  },
  pink70: {
    get color() {
      return DarkMode.enabled ? "#F68FD2" : "#BD00A0"
    },
    value: 70,
  },
  pink80: {
    get color() {
      return DarkMode.enabled ? "#FAB2DF" : "#A00093"
    },
    value: 80,
  },
  pink90: {
    get color() {
      return DarkMode.enabled ? "#FDD4EE" : "#860081"
    },
    value: 90,
  },
  pink100: {
    get color() {
      return DarkMode.enabled ? "#FFF5FB" : "#71006F"
    },
    value: 100,
  },
  rose0: {
    get color() {
      return DarkMode.enabled ? "#450C2A" : "#FFF2F5"
    },
    value: 0,
  },
  rose5: {
    get color() {
      return DarkMode.enabled ? "#5C1037" : "#FFE1E9"
    },
    value: 5,
  },
  rose10: {
    get color() {
      return DarkMode.enabled ? "#721443" : "#FFCFDC"
    },
    value: 10,
  },
  rose20: {
    get color() {
      return DarkMode.enabled ? "#9A2058" : "#FFA0BA"
    },
    value: 20,
  },
  rose30: {
    get color() {
      return DarkMode.enabled ? "#BB2F6B" : "#FF769E"
    },
    value: 30,
  },
  rose40: {
    get color() {
      return DarkMode.enabled ? "#D4437D" : "#FF5187"
    },
    value: 40,
  },
  rose50: {
    get color() {
      return DarkMode.enabled ? "#E45B8F" : "#FF3378"
    },
    value: 50,
  },
  rose60: {
    get color() {
      return DarkMode.enabled ? "#EF78A3" : "#E51966"
    },
    value: 60,
  },
  rose70: {
    get color() {
      return DarkMode.enabled ? "#F597B8" : "#B70752"
    },
    value: 70,
  },
  rose80: {
    get color() {
      return DarkMode.enabled ? "#FAB9CF" : "#8B0040"
    },
    value: 80,
  },
  rose90: {
    get color() {
      return DarkMode.enabled ? "#FDD9E5" : "#660031"
    },
    value: 90,
  },
  rose100: {
    get color() {
      return DarkMode.enabled ? "#FFF5F8" : "#55002A"
    },
    value: 100,
  },
  gray0: {
    get color() {
      return DarkMode.enabled ? "#17171F" : "#FFFFFF"
    },
    value: 0,
  },
  gray5: {
    get color() {
      return DarkMode.enabled ? "#1F1F2A" : "#F4F4FA"
    },
    value: 5,
  },
  gray10: {
    get color() {
      return DarkMode.enabled ? "#272735" : "#E7E7EF"
    },
    value: 10,
  },
  gray15: {
    get color() {
      return DarkMode.enabled ? "#303040" : "#D8D8E4"
    },
    value: 15,
  },
  gray20: {
    get color() {
      return DarkMode.enabled ? "#39394B" : "#CACAD9"
    },
    value: 20,
  },
  gray30: {
    get color() {
      return DarkMode.enabled ? "#4B4B62" : "#ACACC0"
    },
    value: 30,
  },
  gray40: {
    get color() {
      return DarkMode.enabled ? "#5F5F78" : "#9191A8"
    },
    value: 40,
  },
  gray50: {
    get color() {
      return DarkMode.enabled ? "#74748F" : "#787891"
    },
    value: 50,
  },
  gray60: {
    get color() {
      return DarkMode.enabled ? "#8C8CA5" : "#63637B"
    },
    value: 60,
  },
  gray70: {
    get color() {
      return DarkMode.enabled ? "#A6A6BC" : "#515167"
    },
    value: 70,
  },
  gray80: {
    get color() {
      return DarkMode.enabled ? "#C3C3D2" : "#414155"
    },
    value: 80,
  },
  gray90: {
    get color() {
      return DarkMode.enabled ? "#E1E1E9" : "#333344"
    },
    value: 90,
  },
  gray100: {
    get color() {
      return DarkMode.enabled ? "#FFFFFF" : "#0C0B31"
    },
    value: 100,
  },
}
