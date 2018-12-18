import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

class MailService {

     sendMail(to:string,from:string,subject:string,message:string){
           let mailOptions = {
               from :from,
               to: to,
               subject:subject,
               html:message
           }

           const transporter = nodemailer.createTransport(sendgridTransport({
               auth:{
                api_key:'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'
               }
           }))

          return transporter.sendMail(mailOptions)
        }
}
export default new MailService;