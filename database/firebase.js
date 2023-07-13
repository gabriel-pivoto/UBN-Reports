const {initializeApp,cert}= require("firebase-admin/app")
const {getFirestore} = require("firebase-admin/firestore")

const serviceAccount = {
    "type": "service_account",
    "project_id": "fetin-teste",
    "private_key_id": "58f41d268c20d77ab3af9c2b9dc886fb07bdb47a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDO0vJcQleRtDbr\no3MXv58m5p3+li+D5eyOYOsmmLl2raIidOBuYdCFTrGdakSpzJ3EfpCqvuHM8hDp\nupvRkP1vPQxC6hG1X74aDzLJ9FkRJf+qBhYad+W51dkRAYtjQr22ajBdm52unMww\n5C1jmDczrrmeGwGNmMksKzfEqvXRfdCrKZux6ErVqRGiyTwZOb0AxbHbRBm+ns/E\nlybdyO58HOAyHygaej7AhGdTFTRtizgd8iH/5FNuGo+QBAUhMp99ChxC/x/01OJY\n7nTIEbyGYAr8Pbh8DRPNiZUu9v6Zb8sGF7m5nt3mjk9ookFI2/CVj+O8HgMd6HRR\n2PF7mlZrAgMBAAECggEASGi5GkzNvMDD05a7Zi6byTJHUUkCZKK8QZKz8STaFa8v\nivGxW2PabbmB3JNGa84r1A3dlzHR+v8qpbHD+MhSuj28y7aIMaBN/XChvuvRvPu5\nOSz9UxHz9y5j2xzX0I4evj0KJtOjDm1t3ZYdP/ecJ/d9m9lnn0vE7rZIxY13F3rc\nT2T7fn3WtCUl25YIiD9Uazlpc4KOtMYvgjxSWnZY7auYMHpDFPoUTg29D3wqN2/0\n1A02t5KhAudv12jbvKAxXQjdq573ba+UH+t3GS/wwP8XcpDcJp+eYjXXbX0vaEzK\nsxYWDaHkXPVIoC6yNeUrPfZ4TqQ6tfXMbzrL+X0fpQKBgQDpSG/E4RQ8ooSvSGD4\nVRlgadn1MmnPHRDk0/L7uRmAbg8hflbcybHQxEP9wdgzP7exLw6MdllujLmJCRhA\nx9T3tvS+90edhg9/tpsYQT6krdZko36QtRuGTnEZvGmukvvv1v8qREqW/PAVKbGp\nl70UeW6gptR7i3ZADroTmODZdwKBgQDi9ui8GBp5E4eHSAm0bKYQY8cEIQAoPYqA\nG/NRXYB7ICO3ICjxs9vEjFkxDBhT/7pMHfeNhHwCW5YMUFevVZncT6xmOMgBTpCz\nzcsviGzb4wy116zJtxdujxwIx5S6Uk8o3lGtzcvn/6Qcsite5mA+99rg3/XRTDoo\nBbJdXzvnrQKBgCq0POmgflDfO0TPDhlHkr6ogeK12NK2MmqBNiDIcJenDhQGiaYf\nMfLSitPAEXDIQDsqLxKdc5+eGTSxuoPZUO4Lyt/Oaoi2is3JQrj88Je6zt1bZIbe\n8Gv0nhWk/P+dHot4Ivu8xp6/LL/jAwfVpCJEXHECOTFohTwSthNyT+7fAoGBAJmt\nY4LQs0QeFBtmjKOtGXhphvzlt2yH1vrNciA6tl8oMOazEOYvyXO5MD9EmEhwFF2r\nwM4C0dDq4Jtv3x9qT6bcD7ibY9l2sAX/J0AFGOh+QUHzShy/K0+B+RJ8yNisGMts\nVVPgz9tDvoRro3A7fxnDy2GOY6yW953X1aDhdfd1AoGBANAvbKGnUVduVblDpAHr\nrSZ52qplFsB8iKxMfMnsjcE9yXT6EUWbujb1gVSdG2ojaA2pzn1WWundixsD1Nh/\nUv+cG7DQGE3HOomNiFUh+trtP6TVyNS/pXaTyw3/ZgzAN3GrdI8ubS9Rzm9TrHW0\nXJ3rpMPjggrP+THVfg9OeyFA\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xz238@fetin-teste.iam.gserviceaccount.com",
    "client_id":"104217107067489655727",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xz238%40fetin-teste.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  
initializeApp({
    credential:cert(serviceAccount)
})
const db= getFirestore()
module.exports = {db}