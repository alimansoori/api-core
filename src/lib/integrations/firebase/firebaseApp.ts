import { getConfigs } from '@app/lib/config.validator.js'
import { singleton } from 'tsyringe'
import Firebase from 'firebase-admin'
import { logger } from '@app/lib/logger.js'

@singleton()
export class FirebaseAdmin {
  private firebase!: Firebase.app.App
  constructor() {
    this.initializeFirebase()
  }

  private initializeFirebase = async () => {
    const configs = getConfigs()

    // these are the same as google credentials json that can be called out by applicationDefault()
    const GOOGLE_APPLICATION_CREDENTIALS = {
      type: configs.FIREBASE_TYPE,
      project_id: configs.FIREBASE_PROJECT_ID,
      private_key_id: configs.FIREBASE_PRIVATE_KEY_ID,
      private_key: configs.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: configs.FIREBASE_CLIENT_EMAIL,
      client_id: configs.FIREBASE_CLIENT_ID,
      auth_uri: configs.FIREBASE_AUTH_URI,
      token_uri: configs.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: configs.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: configs.FIREBASE_CLIENT_X509_CERT_URL,
    }

    this.firebase = Firebase.initializeApp({
      credential: Firebase.credential.cert(<Firebase.ServiceAccount>GOOGLE_APPLICATION_CREDENTIALS),
    })
    logger.info('Firebase initialized.')
  }

  public getFirebase = () => {
    return this.firebase
  }
}
