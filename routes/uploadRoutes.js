var AWS = require('aws-sdk');
var s3 = new AWS.S3();
const keys = require('../config/keys');
// Make sure you set this env variable correctly
var bucketName = keys.awsBucketName;
AWS.config.update({
  accessKeyId: keys.awsAccessKeyId,
  secretAccessKey: keys.awsSecretAccessKey,
  subregion: 'us-east-1'
});

module.exports = app => {
  app.get('/uploadHandler', async (req, res) => {
    exports.handler = (event, context) => {
      if (!event.hasOwnProperty('contentType')) {
        context.fail({ err: 'Missing contentType' });
      }

      if (!event.hasOwnProperty('filePath')) {
        context.fail({ err: 'Missing filePath' });
      }

      var params = {
        Bucket: bucketName,
        Key: event.filePath,
        Expires: 3600,
        ContentType: event.contentType
      };

      s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          context.fail({ err });
        } else {
          context.succeed({ url });
        }
      });
    };
    res.send(user);
  });

  app.post('/uploadHandler', (req, res) => {
    //req.file is the 'theseNamesMustMatch' file
    s3.putObject(
      {
        Bucket: bucketName,
        Key: keys.awsSecretAccessKey,
        Body: req.file.buffer,
        ACL: 'public-read' // your permisions
      },
      err => {
        if (err) return res.status(400).send(err);
        res.send('File uploaded to S3');
      }
    );
  });
};
