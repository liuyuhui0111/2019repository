### Git分支

- master

```
此分支为生产分支，极少数人有权限操作（运维，主技术负责人，主项目负责人）
```

- develop

```
此分支为开发分支
```

- feature

```
功能分支，它是为了开发某种特定功能，从develop分支上面分出来的。开发完成后，要再并入develop。
```


- release

```
预发布分支，它是指发布正式版本之前（即合并到Master分支之前），我们可能需要有一个预发布的版本进行测试。预发布分支是从Develop分支上面 分出来的，预发布结束以后，必须合并进Develop和Master分支。它的命名，可以采用release-*的形式。
```

- hotfix

```
bug分支。软件正式发布以后，难免会出现bug。这时就需要创建一个分支，进行bug修补。修补bug分支是从Master分支上面分出来的。修补结束以后，再合并进Master和Develop分支。它的命名，可以采用fixbug-*的形式。
```

[git commit 相关提交规范详情](http://blog.yangyong.io/2018/09/24/git/git-commit%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%9A%84%E6%A0%87%E5%87%86%E5%A7%BF%E5%8A%BF%E4%BB%A5%E5%8F%8Arelease-note%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90/)

