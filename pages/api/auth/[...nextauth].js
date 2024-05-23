import NextAuth, { getServerSession } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import YandexProvider from "next-auth/providers/yandex";
import clientPromise from '@/lib/mongodb';
import { useState } from 'react';
import axios from 'axios';
import { mongooseConnect } from '@/lib/mongoose';
import { Email } from '@/models/Email';


// const adminEmails = ['al.simonov20168090@yandex.ru']

var adminEmails = ""
mongooseConnect();
adminEmails = (await Email.find()).map(ob => ob.email);


export const authOptions = {

    providers: [
    YandexProvider({
        clientId: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET
    }),
    ],
    secret : process.env.NEXT_PUBLIC_SECRET,
    adapter: MongoDBAdapter(clientPromise, {
        Users: "ClientUsers",
        Accounts: "ClientAccounts",
        Sessions: "ClientSessions",
        VerificationTokens: "ClientVerificationTokens"
      }),
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