import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'

export class News extends Component {
  static defaultProps ={
    country : 'in',
    pageSize: 6,
    caregory: "general"
  }
  static propsType ={
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  async componentDidMount() {
    let url =
      `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e8a4d529fce94811a4c12431fef58407&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading: true})  
    let data = await fetch(url);
    let parseData = await data.json();
    // console.log(parseData);
    this.setState({ articles: parseData.articles, 
      totalResults: parseData.totalResults,
      loading:false});
  }

  handlePrevClick = async () => {
    console.log("Previous");
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e8a4d529fce94811a4c12431fef58407&page=${
      this.state.page - 1
    }&pageSize=${this.props.pageSize}`;
    this.setState({loading: true});
    let data = await fetch(url);
    let parseData = await data.json();
    this.setState({
      page: this.state.page - 1,
      articles: parseData.articles,
      loading: false
    });
  };

  handleNextClick = async () => {
    if(!(this.state.page + 1> Math.ceil(this.state.totalResults/this.props.pageSize))){
      console.log("Next");
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e8a4d529fce94811a4c12431fef58407&page=${
        this.state.page + 1
      }&pageSize=${this.props.pageSize}`;
      this.setState({loading: true})  
      let data = await fetch(url);
      let parseData = await data.json();
      this.setState({
        page: this.state.page + 1,
        articles: parseData.articles,
        loading: false 
      });
    }
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{margin: '30px 0'}}>Newsverse - Top Headlines</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  imageUrl={
                    element.urlToImage
                      ? element.urlToImage
                      : "https://thumbs.dreamstime.com/b/news-newspapers-folded-stacked-word-wooden-block-puzzle-dice-concept-newspaper-media-press-release-42301371.jpg"
                  }
                  newsUrl={element.url}
                />
              </div>
            );
          })}
        </div>
        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page<=1} className="btn btn-secondary" type="button" onClick={this.handlePrevClick} >&larr; Previous</button>
          <button disabled={ this.state.page + 1> Math.ceil(this.state.totalResults/this.props.pageSize)} className="btn btn-secondary" type="button" onClick={this.handleNextClick} >Next&rarr;</button>
        </div>
      </div>
    );
  }
}

export default News;
