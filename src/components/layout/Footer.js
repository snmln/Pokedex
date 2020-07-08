import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <div className='page-footer my-5'>
                <hr className='w-75' />
                <div class="footer-copyright text-center py-3">© 2020 Copyright:
                 <a href="http://snmln.com/"> 100daysofdev.com</a>
                </div>
            </div>
        );
    }
}

export default Footer;