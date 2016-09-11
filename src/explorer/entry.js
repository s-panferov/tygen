var pathname = window.location.pathname
if (pathname[pathname.length - 1] == '/') {
	pathname = pathname.slice(0, pathname.length - 1)
}

__webpack_public_path__ = pathname + '/assets/'

require('./index')
