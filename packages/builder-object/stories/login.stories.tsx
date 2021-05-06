import React, { useRef, useState } from 'react';
import * as _ from 'lodash';
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { API, Settings, User } from '@steedos/builder-store';
import { Alert, message, Button, Space } from 'antd';



export default {
  title: "Login",
}


const LoginComponent = observer(() => {
    User.getMe();
    if (User.me) {
        const welcome = `Welcome back ${User.me.name}`
        return <Alert message={welcome} type="success" />
    }
    const handleSubmit = () => {
        const emailElement: any = document.getElementById("email");
        const passwordElement: any = document.getElementById("password");

        User.login(emailElement.value, passwordElement.value).then((result: any) => {
            message.success('Login Success');
        })
        
        return false;
    };

    document.title = "Steedos";
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    className="mx-auto h-12 w-auto"
                    src="https://www.steedos.com/img/logo_platform.png"
                    alt="Workflow"
                />
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h2 className="mt-0 text-center text-3xl font-extrabold text-gray-900">登录</h2>
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                邮件地址
              </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                密码
              </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => { return handleSubmit() }}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                提交
                  </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
});

export const Login = () => {
    return <LoginComponent/>
}