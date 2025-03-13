import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { type BookDocument, bookSchema } from './Book.js';

export interface UserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedBooks: [bookSchema], // ✅ Ensures saved books are stored properly
  },
  {
    toJSON: { virtuals: true },
  }
);

// ✅ Hash user password before saving (Prevents double hashing)
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log("🔒 Checking if password is already hashed...");

    // ✅ Prevent double hashing: If the password is already hashed, do not hash again
    if (!this.password.startsWith("$2b$")) {  
      console.log("🔒 Hashing new password before saving...");
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
      console.log("✅ Hashed password stored:", this.password);
    } else {
      console.log("🔄 Password is already hashed. Skipping re-hash.");
    }
  }
  next();
});

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {  // ✅ Ensures password is only hashed when modified
//     console.log("🔒 Hashing new password before saving...");
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltRounds);
//     console.log("✅ Hashed password stored:", this.password);
//   }
//   next();
// });

// ✅ Custom method to compare passwords
userSchema.methods.isCorrectPassword = async function (password: string) {
  console.log("🔍 Comparing entered password:", password);
  console.log("🔍 Stored hashed password:", this.password);

  const match = await bcrypt.compare(password, this.password);
  console.log("🔎 bcrypt.compare() result:", match);  // ✅ Explicitly logging bcrypt result

  return match;
};

// Virtual field for book count
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model<UserDocument>('User', userSchema);
export default User;