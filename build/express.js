const express=require("express"),path=require("path"),PORT=8080,cors=require("cors"),options={origin:"http://react.app.com:8080",credentials:!1},app=express();app.use(cors(options)),app.use(express.static(path.resolve(__dirname))),app.use(express.json()),app.listen(PORT,()=>{console.log(`Server was started on port ${PORT}.`)});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy5qcyIsInNvdXJjZXMiOlsiZXhwcmVzcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5jb25zdCBQT1JUID0gODA4MDtcclxuY29uc3QgY29ycyA9IHJlcXVpcmUoJ2NvcnMnKTtcclxuXHJcblxyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gICAgb3JpZ2luOiAnaHR0cDovL3JlYWN0LmFwcC5jb206ODA4MCcsXHJcbiAgICBjcmVkZW50aWFsczogZmFsc2UsXHJcbn07XHJcblxyXG5cclxuY29uc3QgIGFwcCA9IGV4cHJlc3MoKTtcclxuYXBwLnVzZShjb3JzKG9wdGlvbnMpKTtcclxuYXBwLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lKSkpO1xyXG5hcHAudXNlKGV4cHJlc3MuanNvbigpKTtcclxuXHJcblxyXG5hcHAubGlzdGVuKFBPUlQsICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGBTZXJ2ZXIgd2FzIHN0YXJ0ZWQgb24gcG9ydCAke1BPUlR9LmApO1xyXG59KTsiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJwYXRoIiwiUE9SVCIsImNvcnMiLCJvcHRpb25zIiwib3JpZ2luIiwiY3JlZGVudGlhbHMiLCJhcHAiLCJ1c2UiLCJzdGF0aWMiLCJyZXNvbHZlIiwiX19kaXJuYW1lIiwianNvbiIsImxpc3RlbiIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLFFBQVVDLFFBQVEsV0FDbEJDLEtBQU9ELFFBQVEsUUFDZkUsS0FBTyxLQUNQQyxLQUFPSCxRQUFRLFFBR2ZJLFFBQVUsQ0FDWkMsT0FBUSw0QkFDUkMsYUFBYSxHQUlWQyxJQUFNUixVQUNiUSxJQUFJQyxJQUFJTCxLQUFLQyxVQUNiRyxJQUFJQyxJQUFJVCxRQUFRVSxPQUFPUixLQUFLUyxRQUFRQyxhQUNwQ0osSUFBSUMsSUFBSVQsUUFBUWEsUUFHaEJMLElBQUlNLE9BQU9YLEtBQU0sS0FDYlksUUFBUUMsa0NBQWtDYiJ9
