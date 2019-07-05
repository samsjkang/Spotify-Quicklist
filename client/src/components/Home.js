import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Grid,
  Header,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react'
import Background1 from './pictures/spotify-background.png'

import './App.css';

require('dotenv').config()

let login = 
  process.env.REACT_APP_LOGIN ||
  'http://localhost:5000/login'

const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const HomepageHeading = ({ mobile }) => ( // Header
  <Container text>
    <Header
      as='h1'
      content='Spotify Quicklist'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Quick Playlist Editor'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

class DesktopContainer extends Component { // Desktop Layout
  state = {
    data: null
  };

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 725, padding: '1em 0em' , backgroundImage: `url(${Background1})`}}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Menu.Item position='right'>
                  <Button as='a' href={login} inverted={!fixed}>
                      Get Started 
                  </Button>
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component { // Mobile Layout
  state = {}

  render() {
    const { children } = this.props

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 350, padding: '1em 0em' , backgroundImage: `url(${Background1})`,
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'
          }}
          vertical
        >
          <Container>
            <Menu inverted pointing secondary size='large'>
              <Menu.Item onClick={this.handleToggle}>
              </Menu.Item>
              <Menu.Item position='right'>
                <Button as='a' href='http://localhost:5000/login' inverted>
                  Get Started 
                </Button>
              </Menu.Item>
            </Menu>
          </Container>
          <HomepageHeading mobile />
        </Segment>

        {children}
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => ( // Responsive Layout
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const Home = () => ( // Main Homepage Component
  <ResponsiveContainer >
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Check me out!' />
              <List link inverted>
                <List.Item as='a'>Resume</List.Item>
                <List.Item as='a'>Github</List.Item>
                <List.Item as='a'>LinkedIn</List.Item>
                <List.Item as='a'>Website</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Contact Me' />
              <List link inverted>
                <List.Item as='a'>E-mail</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Made by Samuel Kang
              </Header>
              <p>
                "Convenience Hacker" working on making life more convenient.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </ResponsiveContainer>
)

export default Home