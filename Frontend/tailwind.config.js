/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors:{
        primary:"rgba(215, 241, 72, 1)",
        secondary:"rgba(159, 42, 240, 1)",
        secondaryLight: "rgba(113, 34, 168, 0.09)",
        muted:"rgb(125, 124, 140)",    //rgb(111, 110, 127)
        home:"#EBEAEC",
        borderLight: "rgb(222 226 231)",
        grayMuted: "#e7e7e7",
        grayLightMuted: 'rgb(244, 244, 244)'
      },
      fontFamily:{
        funCity:['funCity'],
        sairaCondensed:['"Saira Condensed", sans-serif']
      },
      fontSize:{
        TitleMain:['35px'],
        descReg1:'15px', // can use this for "subtitleSmall1"
        descReg2:'17px',
        descReg2Med:['17px',{
          fontWeight:'500'
        }],
        descMed1:['19px',{
          fontWeight:'500'
        }],
        impText:['21px',{
          fontWeight:'700'
        }],
        snackbar:['11px',{
          fontWeight:'600'
        }],
        subtitleSmall1:'13px', // this is actually 15px in Figma. Use this if wanted 13px
        // subtitleSmall2:'15px',
        subtitleMain:'41px',
        small:['15px',{
          fontFamily:"Saira Condensed"
        }],
        h3Semibold:['30px',{
          fontWeight:'700'
        }],
        breadcrumbTitle:['23px',{
          fontWeight:'600'
        }],
        h3InterMed1:['54px',{
          fontFamily:'Inter',
          fontWeight:'500'
        }],
        h3InterMed1:['50px',{
          fontFamily:'Inter',
          fontWeight:'500'
        }],
        h2InterMed:['60px',{
          fontFamily:'Inter',
          fontWeight:'600'
        }],
        h6InterReg:'13px',

        adminTitle:['24px',{
          fontWeight:'700'
        }],
        adminSubtitle:['18px'],
        adminSubtitleSmall:['16px',{
          fontWeight:'500'
        }],
        adminDecMed:['15px',{
          fontWeight:'500'
        }],
        adminDecRegInter:['15px',{
          fontFamily:'Inter'
        }],



      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}