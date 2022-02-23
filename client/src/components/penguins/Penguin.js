import style from './penguin.module.scss';

const Penguin = () => {
    return(
        <div className={style.penguin}>
            <div className={style.penguinBottom}>
                <div className={style.rightHand}></div>
                <div className={style.leftHand}></div>
                <div className={style.rightFeet}></div>
                <div className={style.leftFeet}></div>
            </div>
            <div className={style.penguinTop}>
                <div className={style.rightCheek}></div>
                <div className={style.leftCheek}></div>
                <div className={style.belly}></div>
                <div className={style.rightEye}>
                <div className={style.sparkle}></div>
                </div>
                <div className={style.leftEye}>
                <div className={style.sparkle}></div>
                </div>
                <div className={style.blushRight}></div>
                <div className={style.blushLeft}></div>
                <div className={style.beakTop}></div>
                <div className={style.beakBottom}></div>
            </div>
        </div>
    )
}
export default Penguin;