import { getServerSession } from "next-auth";
import { authOptions} from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from "@/models/User";
import { User } from 'next-auth'