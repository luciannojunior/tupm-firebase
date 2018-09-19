const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.getUserFromUsername = functions.https.onRequest(
  ({ query: { username } }, response) => {
    const ref = admin.firestore().collection('users').where('username', '==', username)
    ref.get().then((query) => {
      // query should be an single elements's array
      if (query.length !== 1){
        return response.status(404).end()
      }
      const doc = {...query[0].data()}
      const songsRef = admin.firestore().collection('songs').where('userId', '==', doc)
      songsRef.get().then((query) => {
        if (query){
          doc.songs = query.map(a => a.data());
        }
      })
    }, (err) => {
      console.log(err);
      return response.status(500).json({error: 'Something bad has happened'})
    })
  }
)
