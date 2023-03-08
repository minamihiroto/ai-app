import { useRouter } from "next/router";
import { useAuth } from "../components/AuthProvider";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function Login() {
  const { session, login, loginGoogle } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (session) {
    router.push("/");
  }

  const onSubmit = async (val) => {
    await login({ email: val.email, password: val.password }).then(() =>
      router.push("/")
    );
  };

  const onSubmitGoogle = async () => {
    await loginGoogle().then(() =>
      router.push("/")
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>ログイン</h1>
        <label>メールアドレス</label>
        <input
          // {...register("email", { required: "入力してください" })}
          type="text"
        />
        {errors.email && errors.email.message}
        <label>パスワード</label>
        <input
          // {...register("password", { required: "入力してください" })}
          type="password"
        />
        {errors.password && errors.password.message}
        <button type="submit">送信</button>
        <Link href="/signup">新規登録へ</Link>
      </form>
      <form onSubmit={handleSubmit(onSubmitGoogle)}>
        <button type="submit">googleログイン</button>
      </form>
    </div>
  );
}
