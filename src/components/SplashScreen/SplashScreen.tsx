import React from 'react'
import { Heading1, Heading3, Paragraph } from '@entur/typography'
import { Button } from '@entur/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    SplashArtBoardCircleImage,
    SplashArtBoardCookieImage,
    SplashArtBoardOvalImage,
} from './SplashScreenArt'
import { colors } from '@entur/tokens'

export function SplashScreen(): JSX.Element {
    const navigate = useNavigate()
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <SplashArtBoardOvalImage className="absolute sm:-top-72 sm:left-10 -top-64" />
            <SplashArtBoardCookieImage className="absolute right-[24rem] sm:bottom-12 bottom-20" />
            <SplashArtBoardCircleImage className="absolute bottom-32 right-[-19rem]" />
            <div className="flex flex-col justify-center place-item-center z-10">
                <div className="relative flex flex-row place-items-center space-x-5 justify-center items-center">
                    <Heading1 className="text-white sm:text-6xl text-3xl shrink">
                        EN
                    </Heading1>
                    <div className="sm:w-80 w-38">
                        <ShiftingHeader />
                    </div>
                    <Heading1 className="text-white sm:text-6xl text-3xl shrink">
                        TUR
                    </Heading1>
                </div>
                <div className="flex flex-col place-items-center mt-24 z-10 sm:mr-10">
                    <Heading3 className="text-white font-normal" margin="none">
                        Velkommen om bord!
                    </Heading3>
                    <Paragraph className="text-white max-w-md text-center font-normal">
                        Er du smartere enn vår reiseplanlegger? Bli med på og
                        vinn gratis kollektivreiser!
                    </Paragraph>
                    <div className="w-80">
                        <Button
                            className="font-semibold w-full"
                            onClick={() => navigate('/option')}
                            variant="success"
                        >
                            Kjør!
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SHIFTING_HEADER_WORDS = ['KOLLEKTIV', 'GAMING', 'JAVAZONE']

function ShiftingHeader() {
    const [currentIndex, setIndex] = React.useState(0)

    React.useEffect(() => {
        const id = setInterval(
            () => setIndex((prev) => (prev + 1) % SHIFTING_HEADER_WORDS.length),
            5000,
        )
        return () => clearInterval(id)
    }, [])
    return (
        <AnimatePresence mode="wait">
            <motion.div
                variants={{
                    up: { opacity: 0, y: -40 },
                    visible: { y: 0, opacity: 1 },
                    down: { y: 40, opacity: 0 },
                }}
                initial="up"
                animate="visible"
                exit="down"
                transition={{ ease: 'easeOut' }}
                key={SHIFTING_HEADER_WORDS[currentIndex]}
            >
                <Heading1
                    className="text-coral sm:text-6xl text-3xl shrink italic"
                    style={{ fontWeight: 600, color: colors.brand.coral }}
                >
                    {SHIFTING_HEADER_WORDS[currentIndex]}
                </Heading1>
            </motion.div>
        </AnimatePresence>
    )
}

export default SplashScreen
