import { useRouter } from "next/router";
import { useAuth } from "../components/authProvider.js";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function Signup() {
  const { session, signup } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();


  if (session) {
    router.push("/");
  }

  const onSubmit = async (val) => {
    await signup({ email: val.email, password: val.password })
      .then(() => {
        router.push("/login");
        alert("メールを送信した。ご確認ください。");
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>新規登録</h1>
        <label>メールアドレス</label>
        <input
          {...register("email", { required: "入力してください" })}
          type="text"
        />
        {errors.email && errors.email.message}
        <label>パスワード</label>
        <input
          {...register("password", { required: "入力してください" })}
          type="password"
        />
        {errors.password && errors.password.message}
        <label>パスワード（確認）</label>
        <input
          {...register("passwordConf", {
            required: "入力してください",
            validate: (value) => {
              return (
                value === getValues("password") ||
                "パスワードが一致しません"
              );
            },
          })}
          type="password"
        />
        {errors.passwordConf && errors.passwordConf.message}
        <button type="submit">送信</button>
        <Link href="/login">ログインへ</Link>
      </form>
    </div>
  );
}
