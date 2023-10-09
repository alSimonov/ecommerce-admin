import NextAuth, { getServerSession } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import YandexProvider from "next-auth/providers/yandex";
import clientPromise from '@/lib/mongodb';

const adminEmails = ['al.simonov20168090@yandex.ru']

export const authOptions = {

    providers: [
    YandexProvider({
        clientId: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET
    }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        session: ({session, token, user}) => {
            if(adminEmails.includes(session?.user?.email) ){
                return session;
            } else {
                return false;
            }
        },
    },
}

export default NextAuth(authOptions);

export async function isAdminRequest(req, res){
    const session = await getServerSession(req, res, authOptions);
    if(!adminEmails.includes(session?.user?.email)){
        res.status(401);
        res.end();
        throw 'not an admin';
    }
}