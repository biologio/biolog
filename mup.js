module.exports = {
  servers: {
    one: {
        "host": "45.55.170.129",
        "username": "root",
        "password": "_Rebecca_L0g0"
    }
  },

  meteor: {
    name: 'biolog.io',
    path: '.',
    servers: {
        one: {}
    },
    buildOptions: {
        serverOnly: true,
        debug: true
    },

    env: {
        "PORT": 80,
        "ROOT_URL": "https://biolog.io",
        "MONGO_URL": "mongodb://invent-healthcare:_Rebecca_L0g0@candidate.53.mongolayer.com:10289/invent-healthcare-1",
        "MAIL_URL": "smtp://postmaster%40invent.healthcare:02df280b2370ff54a385b41bb4b0dc02@smtp.mailgun.org:587/"
    },

//    dockerImage: 'abernix:meteord:base',

//    docker: {
//        image: 'abernix/meteord:base'
//      image:'kadirahq/meteord'
//        image: 'ben305/meteord:node4'
//      args:[ //optional, lets you add / overwrite any parameter on the docker run command
//        "--memory-reservation 200M"//memory reservation example
//      ]
//    },

    docker: {
        image: 'abernix/meteord:base'
    },

    ssl: {
        "certificate": "./ssl.pem", // this is a bundle of certificates
        "key": "./biolog.io.nopass.key", // this is the private key of the certificate
        "port": 443 // 443 is the default value and it's the standard HTTPS port
    },
    //dockerImage: 'kadirahq/meteord'
    deployCheckWaitTime: 60


  }

//  mongo: {
//    oplog: true,
//    port: 27017,
//    servers: {
//      one: {},
//    },
//  }


}