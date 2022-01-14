import React, {useEffect, useRef, useState} from 'react';
import styles from "./ShareAsker.module.scss";
import AllAnswerIcon from "../../components/UI/icons/AllAnswerIcon";
import {Link, useLocation, useNavigate} from "react-router-dom";
import ArrowBtn from "../../components/UI/icons/ArrowBtn";
import ShareIcon from "../../components/UI/icons/ShareIcon";
import EditCreateBtn from "../../components/UI/icons/Create/EditCreateBtn";
import ContactLink from "../../components/UI/icons/Contact/ContactLink";
import LetterIcon from "../../components/UI/icons/LetterIcon";
import CloseIcon from "../../components/UI/icons/CloseIcon";
import {Modal} from "react-bootstrap";
import EmailIcon from "../../components/UI/icons/EmailIcon";
import {http} from "../../http/http";
import copy from "copy-html-to-clipboard";

const ShareAsker = ({closeOption, setType, ...props}) => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  let {sharedAskerId} = location.state;
  let navigate = useNavigate();
  const cardRef = useRef(null);
  const [EmailID, setEmailID] = useState("");


  console.log('location.state', location?.state?.sharedAskerId, sharedAskerId)

  useEffect(async () => {

    if (cardRef?.current?.classList.contains("start-rotate")) {
      cardRef?.current?.classList.remove("start-rotate")
    }

    const timer = setTimeout(() => {
      cardRef?.current?.classList.add("start-rotate")
    }, 1);

    return () => clearTimeout(timer);
  }, [props]);

  const showContact = () => {
    navigate('/contact-card')
  }

  const handleClose = () => {
    setShow(false);
  };

  const changeType = (e, type) => {
    e.preventDefault();
    setType(type)
  }

  const handleShow = () => {
    setShow(true);
  };
  const sendEmail = async () => {

    http.post('share-asker-send-mail-api', `email=${EmailID}&asker_code=${sharedAskerId}`)
      .then(resp => resp.data)
      .then((res) => {
        console.log('setShow', res);
        setShow(false);
        // if (res.status === true) {
        //   setViewAsker(res.data);
        // }
      })
      .catch((err) => {
        setShow(false);
        console.log(err);
      })
  };

  const onCopy = (e, type) => {
    e.preventDefault();
    if (type === 'email') {
      copy(`<span>${`askerapp.com/${sharedAskerId}`}</span>`, {
        asHtml: true,
      });
    } else if (type === 'code') {
      copy(`<span>${sharedAskerId}</span>`, {
        asHtml: true,
      });
    }
  };

  return (
    <>
      <>
        <div ref={cardRef} className={`default-flip flip-card-inner  ${styles.cardBg}`}>
          <button className={styles.btnClose} onClick={(e) => closeOption(e)}>
            <CloseIcon className={styles.closeIcon}/>
          </button>
          <div className={styles.cardContainer}>
            <div className={styles.logoBox}>
              <LetterIcon className={styles.letterIcon}/>
            </div>
            <div className={styles.titleBox}>
              <ShareIcon className={styles.shareLink}/>
              Share Asker
            </div>
            <div className={styles.text}>Invite people to answer using this Asker’s unique access code or via direct link:</div>

            <div className={styles.inputBox}>
              <div className={`${styles.inputBlock} `}>
                <div className={styles.textBox}>
                  {/*<input name={'name'} readOnly="readonly" />*/}
                  <input name={'name'} readOnly="readonly" defaultValue={sharedAskerId}/>
                </div>
                <button type='button' className={styles.linkIconWrap} onClick={(e) => onCopy(e, 'code')}>
                  <ContactLink className={styles.linkIcon}/>
                </button>
              </div>
              <div className={`${styles.inputBlock} `}>
                <div className={styles.textBox}>
                  {/*<input name={'name'} readOnly="readonly" />*/}
                  <input name={'name'} readOnly="readonly" placeholder={`askerapp.com/${sharedAskerId}`}/>
                </div>
                <button type='button' className={styles.linkIconWrap} onClick={(e) => onCopy(e, 'email')}>
                  <ContactLink className={styles.linkIcon}/>
                </button>
              </div>
            </div>
            <div className={`button-box ${styles.buttonBox}`}>
              <button type="button" className={`continue-btn  ${styles.buttonStylePublich}`} onClick={handleShow}>
                <span>SHARE NOW</span>
                <div className={styles.plusIconBox}>
                  <ShareIcon className={`${styles.shareIcon}`}/>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.rotate}>
          <div className="triangle-violet"/>
          {/*</div>*/}
        </div>
      </>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="share-email-modal"
      >
        <Modal.Body>
          <div id="shareAskerModal" className={`share-email-modal ${styles.shareEmailModal}`}>
            <a href="#" className="shareAskerModalClose"></a>
            <div className="center-box theme-bg">
              <div className="center-box-inner">
                <div className="log-reg-form">
                  <form method="POST" action="{{route('asker.send_mail')}}">
                    {/* @csrf */}
                    <div className="head">
                      <h4>Share Code</h4>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                    <div className="cust-form-row">
                      <div className="cust-form-col">
                        <div className={`text-filled-modal with-icon ${styles.inputBlock}`}>
                          <input
                            type="hidden"
                            value="{{$asker}}"
                            name="asker_code"
                          />

                          <div className="icon">
                            <EmailIcon className={styles.emailIcon}/>
                          </div>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={(e) => setEmailID(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="cust-form-row" onClick={() => sendEmail()}>
                      <div className="cust-form-col">

                        <div className={`submit-filled with-icon button-box ${styles.buttonBox}`}>
                          <input
                            type="button"
                            value="SHARE"
                            className={`continue-btn shareAskerModalClose ${styles.buttonStylePublich}`}
                          />
                          <div className="icon">
                            <div className={styles.shareIconBox}>
                              <ArrowBtn className={`${styles.shareIcon}`}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
};

export default ShareAsker;
